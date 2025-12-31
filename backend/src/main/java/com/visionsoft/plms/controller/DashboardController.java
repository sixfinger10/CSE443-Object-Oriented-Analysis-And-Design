package com.visionsoft.plms.controller;

import com.visionsoft.plms.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard") // Endpoint'i özelleştirdim, daha düzenli olsun
@CrossOrigin(origins = "*") // Frontend rahat erişsin
public class DashboardController {

    private final LibraryItemRepository libraryItemRepository; // MediaItem yerine LibraryItem
    private final BookRepository bookRepository;
    private final MovieRepository movieRepository;
    private final TVSeriesRepository tvSeriesRepository;
    private final MusicRepository musicRepository;

    public DashboardController(LibraryItemRepository libraryItemRepository,
                               BookRepository bookRepository,
                               MovieRepository movieRepository,
                               TVSeriesRepository tvSeriesRepository,
                               MusicRepository musicRepository) {
        this.libraryItemRepository = libraryItemRepository;
        this.bookRepository = bookRepository;
        this.movieRepository = movieRepository;
        this.tvSeriesRepository = tvSeriesRepository;
        this.musicRepository = musicRepository;
    }

    // 1. Toplam Kütüphane Öğesi Sayısı
    @GetMapping("/total-items")
    public ResponseEntity<Long> getTotalItems(@RequestHeader("X-User-Id") Long userId) {
        Long count = libraryItemRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // 2. Toplam Kitap Sayısı
    @GetMapping("/total-books")
    public ResponseEntity<Long> getTotalBooks(@RequestHeader("X-User-Id") Long userId) {
        Long count = bookRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // 3. Toplam Film Sayısı
    @GetMapping("/total-movies")
    public ResponseEntity<Long> getTotalMovies(@RequestHeader("X-User-Id") Long userId) {
        Long count = movieRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // 4. Toplam Dizi Sayısı
    @GetMapping("/total-series")
    public ResponseEntity<Long> getTotalSeries(@RequestHeader("X-User-Id") Long userId) {
        Long count = tvSeriesRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // 5. Toplam Müzik Sayısı
    @GetMapping("/total-music")
    public ResponseEntity<Long> getTotalMusic(@RequestHeader("X-User-Id") Long userId) {
        Long count = musicRepository.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // 6. Toplam Favori Sayısı (Tüm türler dahil)
    @GetMapping("/total-favorites")
    public ResponseEntity<Long> getTotalFavorites(@RequestHeader("X-User-Id") Long userId) {
        Long count = libraryItemRepository.countByUserIdAndFavorite(userId, true);
        return ResponseEntity.ok(count);
    }
}