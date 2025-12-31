package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Music;
import com.visionsoft.plms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {

    // --- YENİ EKLENEN: User ID'ye göre liste ---
    List<Music> findByUserId(Long userId);

    // 1. Service için: MBID ve User kontrolü (Last.fm ID varsa)
    Optional<Music> findByMbidAndUser(String mbid, User user);

    // 2. Dashboard için
    @Query("SELECT COUNT(m) FROM Music m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // 3. Duplicate check için - Title + Artist (Manuel girişler için)
    @Query("SELECT m FROM Music m WHERE m.user.id = :userId AND m.title = :title AND m.artist = :artist")
    List<Music> findByUserIdAndTitleAndArtist(@Param("userId") Long userId, @Param("title") String title, @Param("artist") String artist);

    // 4. Sadece Title ile kontrol (Fallback)
    @Query("SELECT m FROM Music m WHERE m.user.id = :userId AND m.title = :title")
    List<Music> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);

    // 5. Duplicate check için - TÜM FIELD'LAR (Import Service için gerekli)
    @Query("SELECT m FROM Music m WHERE m.user.id = :userId " +
            "AND m.title = :title " +
            "AND m.artist = :artist " +
            "AND (m.album = :album OR (m.album IS NULL AND :album IS NULL))")
    List<Music> findExactDuplicate(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("artist") String artist,
            @Param("album") String album
    );
}