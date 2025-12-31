package com.visionsoft.plms.dto;

import lombok.Data;

@Data
public class AddTVSeriesRequest {
    // Ortak (LibraryItem)
    private String title;
    private String description;
    private Boolean favorite; // Favori durumu

    // API veya Manuel
    private String imdbId;

    // Series Özel
    private String creator;
    private Integer seasonCount;
    private Integer episodeCount;
    private String network;
    private Integer startYear;
    private Integer endYear;
    private String genre;
}