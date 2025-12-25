package com.visionsoft.plms.controller;

import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;
    private final BookService bookService; // Yeni ekibimiz

    // Constructor Injection (Ekibi içeri alıyoruz)
    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Manuel ekleme (Eskisi gibi)
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    // --- YENİ ÖZELLİK: ISBN ile Getir ---
    @PostMapping("/fetch/{isbn}")
    public Book fetchAndSaveGoogleBook(@PathVariable String isbn) {
        return bookService.saveBookByIsbn(isbn);
    }
}