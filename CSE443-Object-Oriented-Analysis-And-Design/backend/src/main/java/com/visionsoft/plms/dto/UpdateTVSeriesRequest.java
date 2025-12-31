package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateTVSeriesRequest {
    // Ortak Alanlar
    private String title;
    private String description;
    private Boolean favorite;
    private ItemStatus status;
    private Double rating;
    private String imageUrl;

    // Dizi Özel Alanlar
    private String creator;
    private Integer seasonCount;
    private Integer episodeCount;
    private String network;
    private String genre;
}