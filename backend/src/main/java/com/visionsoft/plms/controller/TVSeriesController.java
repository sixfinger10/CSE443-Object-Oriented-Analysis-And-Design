package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddTVSeriesRequest;
import com.visionsoft.plms.dto.UpdateTVSeriesRequest;
import com.visionsoft.plms.entity.TVSeries;
import com.visionsoft.plms.repository.TVSeriesRepository;
import com.visionsoft.plms.service.TVSeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class TVSeriesController {

    private final TVSeriesService tvSeriesService;
    private final TVSeriesRepository tvSeriesRepository;

    public TVSeriesController(TVSeriesService tvSeriesService, TVSeriesRepository tvSeriesRepository) {
        this.tvSeriesService = tvSeriesService;
        this.tvSeriesRepository = tvSeriesRepository;
    }

    @GetMapping
    public List<TVSeries> getAllSeries() {
        return tvSeriesRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<TVSeries> createSeries(
            @RequestBody AddTVSeriesRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tvSeriesService.addTVSeries(request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeries(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        tvSeriesService.deleteSeries(id, userId);
        return ResponseEntity.ok("Dizi başarıyla silindi. ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TVSeries> updateSeries(
            @PathVariable Long id,
            @RequestBody UpdateTVSeriesRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tvSeriesService.updateSeries(id, request, userId));
    }
}