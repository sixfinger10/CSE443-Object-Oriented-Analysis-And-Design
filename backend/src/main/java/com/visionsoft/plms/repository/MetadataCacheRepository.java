package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.MetadataCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MetadataCacheRepository extends JpaRepository<MetadataCache, Long> {
    Optional<MetadataCache> findByLibraryItemId(Long libraryItemId);
}