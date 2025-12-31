package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddBookRequest;
import com.visionsoft.plms.dto.UpdateBookRequest;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final BookRepository bookRepository;

    public BookController(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }

    // --- GÜNCELLENDİ: Sadece giriş yapan kullanıcının kitaplarını getirir ---
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(bookRepository.findByUserId(userId));
    }

    // --- TEK VE ANA METOT ---
    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody AddBookRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        System.out.println("İstek Yapan Kullanıcı ID: " + userId);
        Book savedBook = bookService.addBook(request, userId);
        return ResponseEntity.ok(savedBook);
    }

    // --- SİLME ENDPOINT'İ ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {

        bookService.deleteBook(id, userId);
        return ResponseEntity.ok("Kitap başarıyla silindi. ID: " + id);
    }

    // --- GÜNCELLEME ENDPOINT'İ ---
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody UpdateBookRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        Book updatedBook = bookService.updateBook(id, request, userId);
        return ResponseEntity.ok(updatedBook);
    }
}