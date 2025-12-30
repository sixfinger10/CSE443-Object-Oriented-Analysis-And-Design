package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.TVSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TVSeriesRepository extends JpaRepository<TVSeries, Long> {
    @Query("SELECT COUNT(t) FROM TVSeries t WHERE t.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Duplicate check için
    @Query("SELECT t FROM TVSeries t WHERE t.user.id = :userId AND t.title = :title AND t.creator = :creator")
    List<TVSeries> findByUserIdAndTitleAndCreator(@Param("userId") Long userId, @Param("title") String title, @Param("creator") String creator);
}