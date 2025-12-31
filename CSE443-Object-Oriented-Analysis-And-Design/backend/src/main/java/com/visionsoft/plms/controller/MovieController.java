package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddMovieRequest;
import com.visionsoft.plms.entity.Movie;
import com.visionsoft.plms.repository.MovieRepository;
import com.visionsoft.plms.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    private final MovieRepository movieRepository;

    public MovieController(MovieService movieService, MovieRepository movieRepository) {
        this.movieService = movieService;
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Movie> createMovie(
            @RequestBody AddMovieRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        System.out.println("Film Ekleme İsteği - User ID: " + userId);
        Movie savedMovie = movieService.addMovie(request, userId);
        return ResponseEntity.ok(savedMovie);
    }

    // --- SİLME ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {

        movieService.deleteMovie(id, userId);
        return ResponseEntity.ok("Film başarıyla silindi. ID: " + id);
    }

    // --- GÜNCELLEME ---
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(
            @PathVariable Long id,
            @RequestBody com.visionsoft.plms.dto.UpdateMovieRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        Movie updatedMovie = movieService.updateMovie(id, request, userId);
        return ResponseEntity.ok(updatedMovie);
    }
}