package com.visionsoft.plms.controller;

import com.visionsoft.plms.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final MediaItemRepository mediaItemRepository;
    private final BookRepository bookRepository;
    private final MovieRepository movieRepository;
    private final TVSeriesRepository tvSeriesRepository;
    private final MusicRepository musicRepository;

    public DashboardController(MediaItemRepository mediaItemRepository,
                               BookRepository bookRepository,
                               MovieRepository movieRepository,
                               TVSeriesRepository tvSeriesRepository,
                               MusicRepository musicRepository) {
        this.mediaItemRepository = mediaItemRepository;
        this.bookRepository = bookRepository;
        this.movieRepository = movieRepository;
        this.tvSeriesRepository = tvSeriesRepository;
        this.musicRepository = musicRepository;
    }

    @GetMapping("/total-items")
    public ResponseEntity<Long> getTotalItems(@RequestHeader("userId") Long userId) {
        Long count = mediaItemRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-books")
    public ResponseEntity<Long> getTotalBooks(@RequestHeader("userId") Long userId) {
        Long count = bookRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-movies")
    public ResponseEntity<Long> getTotalMovies(@RequestHeader("userId") Long userId) {
        Long count = movieRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-series")
    public ResponseEntity<Long> getTotalSeries(@RequestHeader("userId") Long userId) {
        Long count = tvSeriesRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-music")
    public ResponseEntity<Long> getTotalMusic(@RequestHeader("userId") Long userId) {
        Long count = musicRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-favorites")
    public ResponseEntity<Long> getTotalFavorites(@RequestHeader("userId") Long userId) {
        Long count = mediaItemRepository.countByUserIdAndFavorite(userId, true);
        return ResponseEntity.ok(count);
    }
}