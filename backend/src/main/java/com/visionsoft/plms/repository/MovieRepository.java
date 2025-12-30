package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByImdbId(String imdbId);

    @Query("SELECT COUNT(m) FROM Movie m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Duplicate check için - Title + Director
    @Query("SELECT m FROM Movie m WHERE m.user.id = :userId AND m.title = :title AND m.director = :director")
    List<Movie> findByUserIdAndTitleAndDirector(@Param("userId") Long userId, @Param("title") String title, @Param("director") String director);
    
    // Duplicate check için - TÜM FIELD'LAR (YENİ!)
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