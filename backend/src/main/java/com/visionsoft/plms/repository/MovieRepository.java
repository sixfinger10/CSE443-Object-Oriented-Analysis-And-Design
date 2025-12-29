package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByImdbId(String imdbId);

    @Query("SELECT COUNT(m) FROM Movie m WHERE m.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
