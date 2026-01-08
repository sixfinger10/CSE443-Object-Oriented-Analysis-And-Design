package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    List<LibraryItem> findByUserId(Long userId);
    Long countByUserId(Long userId);
    Long countByUserIdAndFavorite(Long userId, boolean favorite);
}