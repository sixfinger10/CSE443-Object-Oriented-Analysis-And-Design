package com.visionsoft.plms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@MappedSuperclass // Bu sınıfın özellikleri, bunu miras alan sınıfların tablosuna eklenir.
@Data
public abstract class LibraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    // Her öğe eklendiğinde o anki tarihi otomatik atar
    private LocalDateTime dateAdded = LocalDateTime.now();
}