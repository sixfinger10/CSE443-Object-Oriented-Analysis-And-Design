package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    
    // Kullanıcının tüm kitaplarını getir
    List<LibraryItem> findByUserId(Long userId);
    
    // Başlığa göre arama (like)
    List<LibraryItem> findByTitleContainingIgnoreCase(String title);
    
    // Kullanıcı ve tip bazlı arama
    List<LibraryItem> findByUserIdAndType(Long userId, String type);
    
    // Kullanıcı ve durum bazlı arama
    List<LibraryItem> findByUserIdAndStatus(Long userId, String status);
}