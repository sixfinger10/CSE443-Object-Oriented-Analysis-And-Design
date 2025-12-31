package com.visionsoft.plms.dto;

import lombok.Data;

@Data
public class AddMovieRequest {
    // LibraryItem (Ortak)
    private String title;
    private String description;

    // --- YENİ EKLENEN ---
    private Boolean favorite; // True gelirse favori olarak ekle

    // Movie (Özel)
    private String imdbId;
    private String director;
    private Integer durationMinutes;
    private Double imdbScore;
    private Integer releaseYear;
    private String genre;
    private String castMembers;
}