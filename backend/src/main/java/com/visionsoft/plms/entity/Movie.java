package com.visionsoft.plms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "movies") // Veritabanında 'movies' adında ayrı bir tablo olacak
@Data
public class Movie extends LibraryItem { // DİKKAT: Yine LibraryItem'dan miras alıyoruz!

    // id, title, description, dateAdded otomatik geldi bile!

    private String director; // Yönetmen
    private Integer durationMinutes; // Süre (dk)
    private Double imdbScore; // Puan
}