package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddBookRequest;
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

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // --- TEK VE ANA METOT ---
    // Header'daki "X-User-Id" bilgisini okur ve servise iletir.
    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody AddBookRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        System.out.println("İstek Yapan Kullanıcı ID: " + userId);

        Book savedBook = bookService.addBook(request, userId);
        return ResponseEntity.ok(savedBook);
    }
}