package com.visionsoft.plms.dto;

import lombok.Data; // Lombok kütüphanesini çağırıyoruz

@Data // Bu sihirli kelime, arka planda tüm getter/setter'ları yaratır
public class AddBookRequest {
    // LibraryItem (Ortak)
    private String title;
    private String description;

    // Book (Özel)
    private String isbn;
    private String author;
    private String publisher;
    private Integer publicationYear;
    private Integer pageCount;
    private String genre;
}