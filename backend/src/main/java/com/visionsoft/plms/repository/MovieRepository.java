package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}