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

    // --- YENİ EKLENEN: User ID'ye göre liste ---
    List<TVSeries> findByUserId(Long userId);

    // 1. API Kontrolü: IMDb ID varsa duplicate olmasın
    Optional<TVSeries> findByImdbIdAndUser(String imdbId, User user);

    // 2. Manuel/Fallback Kontrolü: Sadece İsimle Kontrol
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId AND t.title = :title")
    List<TVSeries> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);

    // 3. Detaylı Manuel Kontrol (İsim + Creator)
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId AND t.title = :title AND t.creator = :creator")
    List<TVSeries> findByUserIdAndTitleAndCreator(@Param("userId") Long userId,
                                                  @Param("title") String title,
                                                  @Param("creator") String creator);

    // Dashboard için sayaç
    @Query("SELECT COUNT(t) FROM TVSeries t WHERE t.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // --- IMPORT SERVICE İÇİN GEREKLİ: Tam Eşleşme Kontrolü ---
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