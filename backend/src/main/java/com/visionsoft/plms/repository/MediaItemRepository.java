package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.LibraryItem;
import com.visionsoft.plms.entity.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaItemRepository extends JpaRepository<LibraryItem, Long> {
    List<LibraryItem> findByUserId(Long userId);
    List<LibraryItem> findByUserIdAndType(Long userId, ItemType type);
    List<LibraryItem> findByUserIdAndFavorite(Long userId, boolean favorite);

    @Query("SELECT COUNT(m) FROM LibraryItem m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM LibraryItem m WHERE m.user.id = :userId AND m.favorite = :favorite")
    Long countByUserIdAndFavorite(@Param("userId") Long userId, @Param("favorite") boolean favorite);
}
