package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateMovieRequest {
    // Ortak Alanlar (LibraryItem)
    private String title;
    private String description;
    private Boolean favorite;
    private ItemStatus status; // (WATCHING, COMPLETED, WISHLIST vs.)
    private Double rating;     // Kullanıcının verdiği puan
    private String imageUrl;

    // Filme Özel Alanlar
    private String director;
    private Integer durationMinutes;
    private Integer releaseYear;
    private String genre;
    // IMDb ID genelde değişmez o yüzden koymuyoruz, ama castMembers eklenebilir
    private String castMembers;
}