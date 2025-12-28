package com.visionsoft.plms.entity;

import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.entity.enums.ItemType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "library_items")
@Inheritance(strategy = InheritanceType.JOINED) // Alt sınıflar kendi tablolarına sahip olur
public abstract class LibraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String imageUrl; // Kapak resmi linki

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;

    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.WISHLIST; // Varsayılan: İstek Listesi

    private Integer rating; // 1-10 arası puan

    @Column(name = "is_favorite")
    private boolean favorite = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dateAdded;
}