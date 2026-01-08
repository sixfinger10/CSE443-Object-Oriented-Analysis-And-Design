package com.visionsoft.plms.controller;

import com.visionsoft.plms.repository.*;
import com.visionsoft.plms.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final MediaItemRepository mediaItemRepository;
    private final BookRepository bookRepository;
    private final MovieRepository movieRepository;
    private final TVSeriesRepository tvSeriesRepository;
    private final MusicRepository musicRepository;
    private final JwtUtil jwtUtil;

    public DashboardController(MediaItemRepository mediaItemRepository,
                               BookRepository bookRepository,
                               MovieRepository movieRepository,
                               TVSeriesRepository tvSeriesRepository,
                               MusicRepository musicRepository,
                               JwtUtil jwtUtil) {
        this.mediaItemRepository = mediaItemRepository;
        this.bookRepository = bookRepository;
        this.movieRepository = movieRepository;
        this.tvSeriesRepository = tvSeriesRepository;
        this.musicRepository = musicRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Token'dan user ID çıkar
     */
    private Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No authorization token found");
        }

        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }

        return userId;
    }

    /**
     * Tüm dashboard istatistiklerini tek endpoint'te döndür
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);

            Map<String, Long> stats = new HashMap<>();
            stats.put("totalItems", mediaItemRepository.countByUserId(userId));
            stats.put("totalBooks", bookRepository.countByUserId(userId));
            stats.put("totalMovies", movieRepository.countByUserId(userId));
            stats.put("totalSeries", tvSeriesRepository.countByUserId(userId));
            stats.put("totalMusic", musicRepository.countByUserId(userId));
            stats.put("totalFavorites", mediaItemRepository.countByUserIdAndFavorite(userId, true));

            System.out.println("SUCCESS: Dashboard stats for user " + userId + ": " + stats);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("ERROR in getDashboardStats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total items
     */
    @GetMapping("/total-items")
    public ResponseEntity<Long> getTotalItems(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = mediaItemRepository.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalItems: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total books
     */
    @GetMapping("/total-books")
    public ResponseEntity<Long> getTotalBooks(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = bookRepository.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalBooks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total movies
     */
    @GetMapping("/total-movies")
    public ResponseEntity<Long> getTotalMovies(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = movieRepository.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalMovies: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total series
     */
    @GetMapping("/total-series")
    public ResponseEntity<Long> getTotalSeries(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = tvSeriesRepository.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalSeries: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total music
     */
    @GetMapping("/total-music")
    public ResponseEntity<Long> getTotalMusic(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = musicRepository.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalMusic: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Total favorites
     */
    @GetMapping("/total-favorites")
    public ResponseEntity<Long> getTotalFavorites(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Long count = mediaItemRepository.countByUserIdAndFavorite(userId, true);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTotalFavorites: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}