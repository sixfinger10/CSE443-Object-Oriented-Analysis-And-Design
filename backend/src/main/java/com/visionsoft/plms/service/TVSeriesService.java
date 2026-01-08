package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddTVSeriesRequest;
import com.visionsoft.plms.dto.UpdateTVSeriesRequest;
import com.visionsoft.plms.entity.TVSeries;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.entity.enums.ItemType;
import com.visionsoft.plms.repository.TVSeriesRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class TVSeriesService {

    private final TVSeriesRepository tvSeriesRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // API KEY (AynÄ± key hem film hem dizi iÃ§in geÃ§erli)
    private static final String OMDB_API_KEY = "52794c2b";
    private static final String OMDB_URL = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;

    public TVSeriesService(TVSeriesRepository tvSeriesRepository, UserRepository userRepository) {
        this.tvSeriesRepository = tvSeriesRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "KullanÄ±cÄ± bulunamadÄ±"));
    }

    // --- 1. EKLEME (ADD) ---
    public TVSeries addTVSeries(AddTVSeriesRequest request, Long userId) {

        // A. IMDb ID ile Ekleme
        if (request.getImdbId() != null && !request.getImdbId().isEmpty()) {
            return saveSeriesByImdbId(request.getImdbId(), userId, request.getFavorite());
        }

        // B. Ä°sim ile Arama / Manuel Ekleme
        else {
            User currentUser = getUserById(userId);

            // VeritabanÄ± KontrolÃ¼ (Manuel Duplicate)
            List<TVSeries> existing;
            if (request.getCreator() != null && !request.getCreator().isEmpty()) {
                existing = tvSeriesRepository.findByUserIdAndTitleAndCreator(userId, request.getTitle(), request.getCreator());
            } else {
                existing = tvSeriesRepository.findByUserIdAndTitle(userId, request.getTitle());
            }
            if (!existing.isEmpty()) return existing.get(0);

            // API AramasÄ±
            TVSeries seriesToSave = new TVSeries();
            boolean foundInApi = false;

            try {
                // type=series ile arama yapÄ±yoruz
                String searchUrl = OMDB_URL + "&s=" + request.getTitle().replace(" ", "+") + "&type=series";
                String jsonResponse = restTemplate.getForObject(searchUrl, String.class);
                JsonNode root = objectMapper.readTree(jsonResponse);

                if (root.has("Search") && root.path("Search").size() > 0) {
                    JsonNode bestMatch = findBestMatch(root.path("Search"));
                    String imdbID = bestMatch.path("imdbID").asText();
                    foundInApi = fetchAndMapDetails(imdbID, seriesToSave);
                }
            } catch (Exception e) {
                System.out.println("OMDb API HatasÄ± (Manuel devam): " + e.getMessage());
            }

            // Eksikleri Tamamla
            seriesToSave.setUser(currentUser);
            seriesToSave.setType(ItemType.TV_SERIES);
            seriesToSave.setStatus(ItemStatus.WISHLIST);

            // Favori Bilgisi
            seriesToSave.setFavorite(request.getFavorite() != null ? request.getFavorite() : false);

            // Manuel Veriler (API bulamazsa)
            if (!foundInApi || seriesToSave.getTitle() == null) seriesToSave.setTitle(request.getTitle());
            if (!foundInApi || seriesToSave.getCreator() == null) seriesToSave.setCreator(request.getCreator());

            if (request.getDescription() != null) seriesToSave.setDescription(request.getDescription());
            else if (seriesToSave.getDescription() == null) seriesToSave.setDescription("Manuel eklendi.");

            // Manuel YÄ±l ve Sezon
            if (seriesToSave.getStartYear() == null) seriesToSave.setStartYear(request.getStartYear());
            if (seriesToSave.getSeasonCount() == null) seriesToSave.setSeasonCount(request.getSeasonCount());
            if (request.getNetwork() != null) seriesToSave.setNetwork(request.getNetwork());

            // GÃ¼venlik Kilitleri
            if (seriesToSave.getImdbId() != null) {
                Optional<TVSeries> apiDuplicate = tvSeriesRepository.findByImdbIdAndUser(seriesToSave.getImdbId(), currentUser);
                if (apiDuplicate.isPresent()) return apiDuplicate.get();
            }
            if (seriesToSave.getImdbId() == null) {
                List<TVSeries> manualDuplicate = tvSeriesRepository.findByUserIdAndTitle(userId, seriesToSave.getTitle());
                if (!manualDuplicate.isEmpty()) return manualDuplicate.get(0);
            }

            return tvSeriesRepository.save(seriesToSave);
        }
    }

    public TVSeries saveSeriesByImdbId(String imdbId, Long userId, Boolean isFavorite) {
        User currentUser = getUserById(userId);
        Optional<TVSeries> existing = tvSeriesRepository.findByImdbIdAndUser(imdbId, currentUser);
        if (existing.isPresent()) return existing.get();

        TVSeries series = new TVSeries();
        series.setUser(currentUser);
        series.setType(ItemType.TV_SERIES);
        series.setStatus(ItemStatus.WISHLIST);
        series.setFavorite(isFavorite != null ? isFavorite : false);

        boolean success = fetchAndMapDetails(imdbId, series);
        if (!success) throw new RuntimeException("OMDb API'de dizi bulunamadÄ±: " + imdbId);

        return tvSeriesRepository.save(series);
    }

    // --- 2. SÄ°LME (DELETE) ---
    public void deleteSeries(Long id, Long userId) {
        TVSeries series = tvSeriesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dizi bulunamadÄ± (ID: " + id + ")"));

        if (!series.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu diziyi silme yetkiniz yok!");
        }
        tvSeriesRepository.delete(series);
    }

    // --- 3. GÃœNCELLEME (UPDATE) ---
    public TVSeries updateSeries(Long id, UpdateTVSeriesRequest request, Long userId) {
        TVSeries series = tvSeriesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dizi bulunamadÄ± (ID: " + id + ")"));

        if (!series.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu diziyi gÃ¼ncelleme yetkiniz yok!");
        }

        // Ortak Alanlar
        if (request.getTitle() != null) series.setTitle(request.getTitle());
        if (request.getDescription() != null) series.setDescription(request.getDescription());
        if (request.getFavorite() != null) series.setFavorite(request.getFavorite());
        if (request.getStatus() != null) series.setStatus(request.getStatus());
        if (request.getRating() != null) series.setRating(request.getRating().intValue());
        if (request.getImageUrl() != null) series.setImageUrl(request.getImageUrl());

        // Ã–zel Alanlar
        if (request.getCreator() != null) series.setCreator(request.getCreator());
        if (request.getSeasonCount() != null) series.setSeasonCount(request.getSeasonCount());
        if (request.getEpisodeCount() != null) series.setEpisodeCount(request.getEpisodeCount());
        if (request.getNetwork() != null) series.setNetwork(request.getNetwork());
        if (request.getGenre() != null) series.setGenre(request.getGenre());

        return tvSeriesRepository.save(series);
    }

    // --- YARDIMCI METODLAR ---
    private JsonNode findBestMatch(JsonNode searchResults) {
        JsonNode bestItem = searchResults.get(0);
        Iterator<JsonNode> elements = searchResults.elements();
        while (elements.hasNext()) {
            JsonNode item = elements.next();
            if (item.has("Poster") && !item.path("Poster").asText().equals("N/A")) {
                bestItem = item;
                break;
            }
        }
        return bestItem;
    }

    private boolean fetchAndMapDetails(String imdbId, TVSeries series) {
        try {
            String detailUrl = OMDB_URL + "&i=" + imdbId + "&plot=full";
            String jsonResponse = restTemplate.getForObject(detailUrl, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if ("False".equalsIgnoreCase(root.path("Response").asText())) return false;

            series.setImdbId(imdbId);
            series.setTitle(root.path("Title").asText());
            series.setGenre(root.path("Genre").asText());
            series.setCastMembers(root.path("Actors").asText());

            // Writer -> Creator eÅŸleÅŸtirmesi
            String writer = root.path("Writer").asText();
            series.setCreator("N/A".equals(writer) ? root.path("Director").asText() : writer);

            // "2011â€“2019" YÄ±l AyrÄ±ÅŸtÄ±rma MantÄ±ÄŸÄ±
            String yearStr = root.path("Year").asText(); // Ã–rn: "2011â€“2019" veya "2022â€“"
            parseSeriesYears(yearStr, series);

            // Toplam Sezon
            String totalSeasons = root.path("totalSeasons").asText();
            if (!"N/A".equals(totalSeasons)) {
                series.setSeasonCount(parseInteger(totalSeasons));
            }

            // Puan
            String rating = root.path("imdbRating").asText();
            if (!"N/A".equals(rating)) series.setImdbScore(Double.parseDouble(rating));

            String plot = root.path("Plot").asText();
            series.setDescription("N/A".equals(plot) ? "AÃ§Ä±klama yok." : plot);

            String poster = root.path("Poster").asText();
            if (!"N/A".equals(poster)) series.setImageUrl(poster);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void parseSeriesYears(String yearStr, TVSeries series) {
        try {
            // "2011â€“2019" -> "-" veya "â€“" ile bÃ¶lÃ¼nebilir
            String[] parts = yearStr.split("[-â€“]");

            if (parts.length >= 1) {
                // BaÅŸlangÄ±Ã§ YÄ±lÄ± (Her tÃ¼rlÃ¼ vardÄ±r)
                String start = parts[0].replaceAll("[^0-9]", "");
                if (!start.isEmpty()) series.setStartYear(Integer.parseInt(start));
            }

            if (parts.length >= 2) {
                // BitiÅŸ YÄ±lÄ± (Varsa)
                String end = parts[1].replaceAll("[^0-9]", "");
                if (!end.isEmpty()) series.setEndYear(Integer.parseInt(end));
            }
        } catch (Exception e) {
            System.out.println("YÄ±l ayrÄ±ÅŸtÄ±rma hatasÄ±: " + yearStr);
        }
    }

    private Integer parseInteger(String val) {
        try { return Integer.parseInt(val.trim()); } catch (Exception e) { return null; }
    }
}