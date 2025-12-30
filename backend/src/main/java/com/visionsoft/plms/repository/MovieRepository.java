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

    // --- 4. YENİ EKLENEN: Sadece İsim Kontrolü (Yönetmen girilmediyse bunu kullanacağız) ---
    @Query("SELECT m FROM Movie m WHERE m.user.id = :userId AND m.title = :title")
    List<Movie> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);
}