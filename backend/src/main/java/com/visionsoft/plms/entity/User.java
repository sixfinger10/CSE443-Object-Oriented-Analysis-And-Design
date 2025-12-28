package com.visionsoft.plms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Şifrelenmiş hali tutulacak

    // Kullanıcının kütüphanesindeki tüm öğeler
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<LibraryItem> libraryItems;

    // Kullanıcının özel listeleri (Favoriler, Yaz Tatili Listesi vb.)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<MediaList> mediaLists;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}