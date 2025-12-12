package com.visionsoft.plms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true) // Üst sınıftaki (id, title) eşitlik kontrolüne dahil et
@Entity
@Table(name = "books")
@Data
public class Book extends LibraryItem { // ARTIK MİRAS ALIYOR

    // id, title, description, dateAdded artık LibraryItem'dan geliyor.
    // Buraya sadece KİTABA ÖZEL olanları yazıyoruz.

    private String author;
    private String isbn;
    private Integer publicationYear;
    private String genre;
}