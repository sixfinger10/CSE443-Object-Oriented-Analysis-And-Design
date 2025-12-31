package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {

    // Toplam öğe sayısı (Kitap + Film + Müzik + Dizi)
    Long countByUserId(Long userId);

    // Toplam Favori sayısı
    Long countByUserIdAndFavorite(Long userId, boolean favorite);

    List<LibraryItem> findByUserId(Long userId);
}