package com.visionsoft.plms.dto;

import lombok.Data;

@Data
public class AddMusicRequest {
    // Ortak
    private String title;       // Şarkı Adı
    private String description;
    private Boolean favorite;

    // Music Özel
    private String artist;      // Sanatçı (API araması için kritik)
    private String album;
    private String genre;
    private Integer durationSeconds;
    private Integer releaseYear;
    private String mbid;        // Eğer kullanıcı biliyorsa (nadiren kullanılır)
}