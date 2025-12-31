package com.visionsoft.plms.entity;

import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.entity.enums.ItemType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "library_items")
@Inheritance(strategy = InheritanceType.JOINED)
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

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    protected ItemType type;

    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.WISHLIST;

    private Integer rating;

    @Column(name = "is_favorite")
    private boolean favorite = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dateAdded;
}