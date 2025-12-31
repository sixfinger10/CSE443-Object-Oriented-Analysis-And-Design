package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateMusicRequest {
    // Ortak
    private String title;
    private String description;
    private Boolean favorite;
    private ItemStatus status;
    private Double rating;
    private String imageUrl;

    // Music Özel
    private String artist;
    private String album;
    private String genre;
    private Integer durationSeconds;
    private Integer releaseYear;
}