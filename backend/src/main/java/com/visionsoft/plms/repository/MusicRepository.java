package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {
    @Query("SELECT COUNT(m) FROM Music m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Duplicate check için
    @Query("SELECT m FROM Music m WHERE m.user.id = :userId AND m.title = :title AND m.artist = :artist")
    List<Music> findByUserIdAndTitleAndArtist(@Param("userId") Long userId, @Param("title") String title, @Param("artist") String artist);
}