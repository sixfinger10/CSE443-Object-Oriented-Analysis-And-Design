package com.visionsoft.plms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "media_list_items",
        uniqueConstraints = @UniqueConstraint(columnNames = {"media_list_id", "library_item_id"}))
public class MediaListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_list_id", nullable = false)
    private MediaList mediaList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_item_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LibraryItem libraryItem;

    private Integer itemOrder; // Listede kaçıncı sırada?

    @CreationTimestamp
    private LocalDateTime addedAt;
}