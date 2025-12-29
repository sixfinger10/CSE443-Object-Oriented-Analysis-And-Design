package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.MediaList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaListRepository extends JpaRepository<MediaList, Long> {
    List<MediaList> findByUserId(Long userId);
}
