package com.visionsoft.plms.dto;

import lombok.Data;

@Data
public class AddBookRequest {
    private String title;
    private String description;
    private Boolean favorite;  // FAVORITE VAR MI? ✅
    private String isbn;
    private String author;
    private String publisher;
    private Integer publicationYear;
    private Integer pageCount;
    private String genre;
}