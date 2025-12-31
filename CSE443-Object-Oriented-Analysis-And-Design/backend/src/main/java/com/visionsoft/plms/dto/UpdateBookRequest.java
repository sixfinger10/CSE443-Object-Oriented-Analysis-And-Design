package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateBookRequest {
    // Ortak Alanlar (LibraryItem)
    private String title;
    private String description;
    private Boolean favorite;
    private ItemStatus status; // (Okuyorum, Bitti, İstek Listesi vb.)
    private Double rating;     // Kullanıcının verdiği puan (Varsa)
    private String imageUrl;   // Kullanıcı belki kendi resmini yükler

    // Kitaba Özel Alanlar
    private String author;
    private String publisher;
    private Integer pageCount;
    // ISBN genelde güncellenmez ama çok istersen ekleyebilirsin, şimdilik gerek yok.
}