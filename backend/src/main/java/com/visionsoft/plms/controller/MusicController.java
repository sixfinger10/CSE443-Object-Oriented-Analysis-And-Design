package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddMusicRequest;
import com.visionsoft.plms.dto.UpdateMusicRequest;
import com.visionsoft.plms.entity.Music;
import com.visionsoft.plms.repository.MusicRepository;
import com.visionsoft.plms.service.MusicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final MusicService musicService;
    private final MusicRepository musicRepository;

    public MusicController(MusicService musicService, MusicRepository musicRepository) {
        this.musicService = musicService;
        this.musicRepository = musicRepository;
    }

    // --- GÜNCELLENDİ: Sadece giriş yapan kullanıcının müziklerini getirir ---
    @GetMapping
    public ResponseEntity<List<Music>> getAllMusic(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(musicRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Music> createMusic(
            @RequestBody AddMusicRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(musicService.addMusic(request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMusic(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        musicService.deleteMusic(id, userId);
        return ResponseEntity.ok("Müzik başarıyla silindi. ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Music> updateMusic(
            @PathVariable Long id,
            @RequestBody UpdateMusicRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(musicService.updateMusic(id, request, userId));
    }
}