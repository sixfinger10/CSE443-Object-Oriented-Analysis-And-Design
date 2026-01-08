package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.TVSeries;
import com.visionsoft.plms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TVSeriesRepository extends JpaRepository<TVSeries, Long> {

    // 1. API KontrolÃ¼: IMDb ID varsa duplicate olmasÄ±n
    Optional<TVSeries> findByImdbIdAndUser(String imdbId, User user);

    // 2. Manuel/Fallback KontrolÃ¼: Sadece Ä°simle Kontrol
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId AND t.title = :title")
    List<TVSeries> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);

    // 3. DetaylÄ± Manuel Kontrol (Ä°sim + Creator)
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId AND t.title = :title AND t.creator = :creator")
    List<TVSeries> findByUserIdAndTitleAndCreator(@Param("userId") Long userId,
                                                  @Param("title") String title,
                                                  @Param("creator") String creator);

    // Dashboard iÃ§in sayaÃ§
    @Query("SELECT COUNT(t) FROM TVSeries t WHERE t.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // --- IMPORT SERVICE Ä°Ã‡Ä°N GEREKLÄ°: Tam EÅŸleÅŸme KontrolÃ¼ ---
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId " +
            "AND t.title = :title " +
            "AND t.creator = :creator " +
            "AND (t.startYear = :startYear OR (t.startYear IS NULL AND :startYear IS NULL))")
    List<TVSeries> findExactDuplicate(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("creator") String creator,
            @Param("startYear") Integer startYear
    );
}