package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Movie;
import com.visionsoft.plms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // --- YENİ EKLENEN: User ID'ye göre liste ---
    List<Movie> findByUserId(Long userId);

    // 1. Service için: IMDb ID ve User kontrolü
    Optional<Movie> findByImdbIdAndUser(String imdbId, User user);

    // 2. Dashboard için
    @Query("SELECT COUNT(m) FROM Movie m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // 3. Manuel ekleme kontrolü (İsim ve Yönetmen)
    @Query("SELECT m FROM Movie m WHERE m.user.id = :userId AND m.title = :title AND m.director = :director")
    List<Movie> findByUserIdAndTitleAndDirector(@Param("userId") Long userId,
                                                @Param("title") String title,
                                                @Param("director") String director);

    // --- 4. Sadece İsim Kontrolü ---
    @Query("SELECT m FROM Movie m WHERE m.user.id = :userId AND m.title = :title")
    List<Movie> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);

    // --- 5. Detaylı Duplicate Kontrolü ---
    @Query("SELECT m FROM Movie m WHERE m.user.id = :userId " +
            "AND m.title = :title " +
            "AND m.director = :director " +
            "AND (m.releaseYear = :releaseYear OR (m.releaseYear IS NULL AND :releaseYear IS NULL))")
    List<Movie> findExactDuplicate(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("director") String director,
            @Param("releaseYear") Integer releaseYear
    );
}