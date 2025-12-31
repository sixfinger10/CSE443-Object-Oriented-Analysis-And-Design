package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddMusicRequest;
import com.visionsoft.plms.dto.UpdateMusicRequest;
import com.visionsoft.plms.entity.Music;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.entity.enums.ItemType;
import com.visionsoft.plms.repository.MusicRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class MusicService {

    private final MusicRepository musicRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // LAST.FM API KEY
    private static final String API_KEY = "a991a092665e75040f4a934f9c8d8e74";
    private static final String BASE_URL = "http://ws.audioscrobbler.com/2.0/";

    public MusicService(MusicRepository musicRepository, UserRepository userRepository) {
        this.musicRepository = musicRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
    }

    // --- 1. EKLEME (ADD) ---
    public Music addMusic(AddMusicRequest request, Long userId) {
        User currentUser = getUserById(userId);

        // A. Veritabanı Kontrolü (Duplicate Check)
        List<Music> existing;
        if (request.getArtist() != null && !request.getArtist().isEmpty()) {
            existing = musicRepository.findByUserIdAndTitleAndArtist(userId, request.getTitle(), request.getArtist());
        } else {
            existing = musicRepository.findByUserIdAndTitle(userId, request.getTitle());
        }
        if (!existing.isEmpty()) return existing.get(0);

        // B. Last.fm API Araması
        Music musicToSave = new Music();
        boolean foundInApi = false;

        try {
            // İsim + Artist araması yap
            String searchUrl = BASE_URL + "?method=track.search&track=" + request.getTitle().replace(" ", "+") +
                    "&api_key=" + API_KEY + "&format=json";

            if (request.getArtist() != null && !request.getArtist().isEmpty()) {
                searchUrl += "&artist=" + request.getArtist().replace(" ", "+");
            }

            String jsonResponse = restTemplate.getForObject(searchUrl, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode trackMatches = root.path("results").path("trackmatches").path("track");

            if (trackMatches.isArray() && trackMatches.size() > 0) {
                // En iyi eşleşmeyi bul
                JsonNode bestMatch = trackMatches.get(0);
                String trackName = bestMatch.path("name").asText();
                String artistName = bestMatch.path("artist").asText();
                String mbid = bestMatch.path("mbid").asText();

                // 2. Adım: Detayları Çek (track.getInfo) - Çünkü search sonucu duration veya genre vermez
                foundInApi = fetchAndMapDetails(trackName, artistName, mbid, musicToSave);
            }

        } catch (Exception e) {
            System.out.println("Last.fm API Hatası (Manuel devam): " + e.getMessage());
        }

        // C. Eksikleri Tamamla
        musicToSave.setUser(currentUser);
        musicToSave.setType(ItemType.MUSIC);
        musicToSave.setStatus(ItemStatus.WISHLIST);
        musicToSave.setFavorite(request.getFavorite() != null ? request.getFavorite() : false);

        // Manuel Veriler
        if (!foundInApi || musicToSave.getTitle() == null) musicToSave.setTitle(request.getTitle());
        if (!foundInApi || musicToSave.getArtist() == null) musicToSave.setArtist(request.getArtist());

        if (request.getDescription() != null) musicToSave.setDescription(request.getDescription());
        else if (musicToSave.getDescription() == null) musicToSave.setDescription("Manuel eklendi.");

        if (request.getAlbum() != null) musicToSave.setAlbum(request.getAlbum());
        if (request.getReleaseYear() != null) musicToSave.setReleaseYear(request.getReleaseYear());
        if (request.getGenre() != null) musicToSave.setGenre(request.getGenre()); // API bulamadıysa user'ınkini al

        // Güvenlik Kilidi (MBID varsa)
        if (musicToSave.getMbid() != null && !musicToSave.getMbid().isEmpty()) {
            Optional<Music> duplicate = musicRepository.findByMbidAndUser(musicToSave.getMbid(), currentUser);
            if (duplicate.isPresent()) return duplicate.get();
        }

        return musicRepository.save(musicToSave);
    }

    // --- 2. SİLME (DELETE) ---
    public void deleteMusic(Long id, Long userId) {
        Music music = musicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Müzik bulunamadı"));

        if (!music.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu müziği silme yetkiniz yok");
        }
        musicRepository.delete(music);
    }

    // --- 3. GÜNCELLEME (UPDATE) ---
    public Music updateMusic(Long id, UpdateMusicRequest request, Long userId) {
        Music music = musicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Müzik bulunamadı"));

        if (!music.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu müziği güncelleme yetkiniz yok");
        }

        // Ortak
        if (request.getTitle() != null) music.setTitle(request.getTitle());
        if (request.getDescription() != null) music.setDescription(request.getDescription());
        if (request.getFavorite() != null) music.setFavorite(request.getFavorite());
        if (request.getStatus() != null) music.setStatus(request.getStatus());
        if (request.getRating() != null) music.setRating(request.getRating().intValue());
        if (request.getImageUrl() != null) music.setImageUrl(request.getImageUrl());

        // Özel
        if (request.getArtist() != null) music.setArtist(request.getArtist());
        if (request.getAlbum() != null) music.setAlbum(request.getAlbum());
        if (request.getGenre() != null) music.setGenre(request.getGenre());
        if (request.getDurationSeconds() != null) music.setDurationSeconds(request.getDurationSeconds());
        if (request.getReleaseYear() != null) music.setReleaseYear(request.getReleaseYear());

        return musicRepository.save(music);
    }

    // --- YARDIMCI METOD: Detay Çekme ---
    private boolean fetchAndMapDetails(String track, String artist, String mbid, Music music) {
        try {
            String detailUrl = BASE_URL + "?method=track.getInfo&api_key=" + API_KEY + "&format=json" +
                    "&artist=" + artist.replace(" ", "+") +
                    "&track=" + track.replace(" ", "+");

            String jsonResponse = restTemplate.getForObject(detailUrl, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode trackNode = root.path("track");

            if (trackNode.isMissingNode()) return false;

            music.setTitle(trackNode.path("name").asText());
            music.setArtist(trackNode.path("artist").path("name").asText());

            if (mbid != null && !mbid.isEmpty()) music.setMbid(mbid);

            // Albüm Bilgisi
            JsonNode albumNode = trackNode.path("album");
            if (!albumNode.isMissingNode()) {
                music.setAlbum(albumNode.path("title").asText());

                // Resim (large veya extralarge alalım)
                JsonNode images = albumNode.path("image");
                if (images.isArray()) {
                    for (JsonNode img : images) {
                        if ("extralarge".equals(img.path("size").asText()) || "large".equals(img.path("size").asText())) {
                            String url = img.path("#text").asText();
                            if (!url.isEmpty()) music.setImageUrl(url);
                        }
                    }
                }
            }

            // Süre (API milisaniye döner -> saniyeye çevir)
            String durationMs = trackNode.path("duration").asText();
            if (durationMs != null && !durationMs.equals("0")) {
                music.setDurationSeconds(Integer.parseInt(durationMs) / 1000);
            }

            // Genre (Top Tags)
            JsonNode tags = trackNode.path("toptags").path("tag");
            if (tags.isArray() && tags.size() > 0) {
                music.setGenre(tags.get(0).path("name").asText());
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}