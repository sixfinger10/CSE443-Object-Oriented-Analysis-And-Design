package com.visionsoft.plms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "media_lists")
public class MediaList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String name; // Örn: "Favorilerim", "Tatil Listesi"

    // Listenin içindeki elemanlar (Sıralı)
    @OneToMany(mappedBy = "mediaList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MediaListItem> items;

    @CreationTimestamp
    private LocalDateTime createdAt;
}