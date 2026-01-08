package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateBookRequest {
    // Ortak Alanlar (Tüm Item tipleri için)
    private String title;
    private String description;
    private Boolean favorite;
    private ItemStatus status;
    private Double rating;
    private String imageUrl;

    // Kitaba Özel Alanlar
    private String author;
    private String publisher;
    private Integer pageCount;
    private Integer publicationYear;  // ✅ YENİ - Frontend gönderiyordu
    private String genre;             // ✅ YENİ - Frontend gönderiyordu
    private String isbn;              // ✅ YENİ - Edit'te ISBN değişebilir
    private String language;          // ✅ YENİ - Dil bilgisi (opsiyonel)
}