package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddMovieRequest;
import com.visionsoft.plms.entity.Movie;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.entity.enums.ItemType;
import com.visionsoft.plms.repository.MovieRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // SENİN API KEY'İN
    private static final String OMDB_API_KEY = "52794c2b";
    private static final String OMDB_URL = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;

    public MovieService(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("HATA: ID'si " + userId + " olan kullanıcı bulunamadı!"));
    }

    // --- AKILLI EKLEME METODU ---
    public Movie addMovie(AddMovieRequest request, Long userId) {

        // DURUM 1: Kullanıcı IMDb ID girmiş (Direkt nokta atışı)
        if (request.getImdbId() != null && !request.getImdbId().isEmpty()) {
            return saveMovieByImdbId(request.getImdbId(), userId);
        }

        // DURUM 2: Kullanıcı İsim Girmiş (Arama Yapacağız)
        else {
            User currentUser = getUserById(userId);

            // A. Veritabanı Kontrolü (Manuel giriş için)
            // Eğer başlık ve yönetmen tutuyorsa tekrar ekleme
            if (request.getDirector() != null) {
                List<Movie> existing = movieRepository.findByUserIdAndTitleAndDirector(
                        userId, request.getTitle(), request.getDirector()
                );
                if (!existing.isEmpty()) return existing.get(0);
            }

            // B. OMDb API'de Ara
            Movie movieToSave = new Movie();
            boolean foundInApi = false;

            try {
                // Film araması yapıyoruz (type=movie ekledik ki diziler karışmasın)
                String searchUrl = OMDB_URL + "&s=" + request.getTitle().replace(" ", "+") + "&type=movie";
                String jsonResponse = restTemplate.getForObject(searchUrl, String.class);
                JsonNode root = objectMapper.readTree(jsonResponse);

                if (root.has("Search") && root.path("Search").size() > 0) {

                    // 1. ADIM: Listeden En İyi Filmi Seç (Posteri olanı tercih et)
                    JsonNode bestMatch = findBestMatch(root.path("Search"));
                    String imdbID = bestMatch.path("imdbID").asText();

                    // 2. ADIM: Seçilen ID ile Detayları Çek (Çünkü Search listesi detay vermez)
                    // saveMovieByImdbId metodunu çağırmıyoruz çünkü o save ediyor, biz burada merge yapıcaz.
                    // O yüzden detay çekme işini buraya inline yapıyorum veya helper kullanıyorum.

                    foundInApi = fetchAndMapDetails(imdbID, movieToSave);
                }

            } catch (Exception e) {
                System.out.println("OMDb API Hatası (Manuel devam): " + e.getMessage());
            }

            // C. Eksikleri Tamamla ve Kaydet
            movieToSave.setUser(currentUser);
            movieToSave.setType(ItemType.MOVIE);
            movieToSave.setStatus(ItemStatus.WISHLIST); // Varsayılan

            // API bulamadıysa kullanıcının girdiklerini al
            if (!foundInApi || movieToSave.getTitle() == null) movieToSave.setTitle(request.getTitle());
            if (!foundInApi || movieToSave.getDirector() == null) movieToSave.setDirector(request.getDirector());

            // Manuel alanlar
            if (request.getDescription() != null) movieToSave.setDescription(request.getDescription());
            else if (movieToSave.getDescription() == null) movieToSave.setDescription("Manuel eklendi.");

            // Manuel override (Kullanıcı API'den geleni beğenmeyip kendi girdiyse ezsin mi? Genelde hayır, boşsa doldururuz)
            if (movieToSave.getReleaseYear() == null) movieToSave.setReleaseYear(request.getReleaseYear());
            if (movieToSave.getGenre() == null) movieToSave.setGenre(request.getGenre());

            // --- GÜVENLİK KİLİDİ (SON KONTROL) ---
            if (movieToSave.getImdbId() != null) {
                Optional<Movie> duplicateCheck = movieRepository.findByImdbIdAndUser(movieToSave.getImdbId(), currentUser);
                if (duplicateCheck.isPresent()) return duplicateCheck.get();
            }

            return movieRepository.save(movieToSave);
        }
    }

    // --- SADECE IMDB ID İLE KAYDETME ---
    public Movie saveMovieByImdbId(String imdbId, Long userId) {
        User currentUser = getUserById(userId);

        // Zaten var mı?
        Optional<Movie> existing = movieRepository.findByImdbIdAndUser(imdbId, currentUser);
        if (existing.isPresent()) return existing.get();

        Movie movie = new Movie();
        movie.setUser(currentUser);
        movie.setType(ItemType.MOVIE);
        movie.setStatus(ItemStatus.WISHLIST);

        // Detayları çek
        boolean success = fetchAndMapDetails(imdbId, movie);

        if (!success) {
            throw new RuntimeException("OMDb API'de bu ID ile film bulunamadı: " + imdbId);
        }

        return movieRepository.save(movie);
    }

    // --- YARDIMCI METOD: EN İYİ EŞLEŞMEYİ BULMA ---
    private JsonNode findBestMatch(JsonNode searchResults) {
        JsonNode bestItem = searchResults.get(0); // Varsayılan ilk

        // Basit Mantık: Posteri "N/A" olmayan ilk kaydı bulsak yeterli.
        // OMDb sıralaması genelde popülerliğe göredir zaten.
        Iterator<JsonNode> elements = searchResults.elements();
        while (elements.hasNext()) {
            JsonNode item = elements.next();
            if (item.has("Poster") && !item.path("Poster").asText().equals("N/A")) {
                bestItem = item;
                break; // Posteri olanı bulduk, yapış.
            }
        }
        return bestItem;
    }

    // --- YARDIMCI METOD: ID'DEN DETAY ÇEK VE MAPLE ---
    private boolean fetchAndMapDetails(String imdbId, Movie movie) {
        try {
            String detailUrl = OMDB_URL + "&i=" + imdbId + "&plot=full"; // plot=full uzun özet verir
            String jsonResponse = restTemplate.getForObject(detailUrl, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if ("False".equalsIgnoreCase(root.path("Response").asText())) {
                return false;
            }

            // Mapping
            movie.setImdbId(imdbId);
            movie.setTitle(root.path("Title").asText());
            movie.setDirector(root.path("Director").asText());
            movie.setGenre(root.path("Genre").asText());
            movie.setCastMembers(root.path("Actors").asText());

            // Yıl "2012"
            String yearStr = root.path("Year").asText().replaceAll("[^0-9]", "");
            if (!yearStr.isEmpty()) movie.setReleaseYear(Integer.parseInt(yearStr.substring(0, 4)));

            // Süre "142 min" -> 142
            String runtime = root.path("Runtime").asText();
            if (runtime.contains("min")) {
                movie.setDurationMinutes(parseInteger(runtime.replace(" min", "")));
            }

            // Puan "8.5"
            String rating = root.path("imdbRating").asText();
            if (!"N/A".equals(rating)) {
                movie.setImdbScore(Double.parseDouble(rating));
            }

            // Açıklama
            String plot = root.path("Plot").asText();
            movie.setDescription("N/A".equals(plot) ? "Açıklama yok." : plot);

            // Resim
            String poster = root.path("Poster").asText();
            if (!"N/A".equals(poster)) {
                movie.setImageUrl(poster);
            }

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Sayı dönüşümleri için güvenli metod
    private Integer parseInteger(String val) {
        try {
            return Integer.parseInt(val.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}