package com.visionsoft.plms.dto;

import lombok.Data;

@Data
public class AddBookRequest {
    // LibraryItem (Ortak) Alanları
    private String title;
    private String description;

    // Book (Özel) Alanları
    private String isbn;
    private String author;
    private String publisher;
    private Integer publicationYear;
    private Integer pageCount;
    private String genre;
}