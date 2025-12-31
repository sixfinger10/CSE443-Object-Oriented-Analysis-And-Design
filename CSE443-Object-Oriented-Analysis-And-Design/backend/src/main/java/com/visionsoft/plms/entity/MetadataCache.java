package com.visionsoft.plms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "metadata_cache")
public class MetadataCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Hangi item ile ilişkili?
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_item_id", unique = true)
    private LibraryItem libraryItem;

    // JSON formatında ham veri (Google Books veya OMDB'den gelen tüm cevap)
    @Column(columnDefinition = "TEXT")
    private String rawJsonData;

    private String source; // "GOOGLE_BOOKS", "OMDB" vb.

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}