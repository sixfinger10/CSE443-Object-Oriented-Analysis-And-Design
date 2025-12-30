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

    // Constructor Injection
    public BookController(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }

    // 1. KİTAPLARI LİSTELE (GET)
    // Bunu silmedik, çünkü listeyi görmek istersin.
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // 2. KİTAP EKLE (POST) - TEK VE AKILLI GİRİŞ KAPISI
    // Artık hem ISBN'li hem de Manuel eklemeyi bu tek metot hallediyor.
    // Frontend'den gelen JSON'a (AddBookRequest) bakıyor, Service'e yolluyor.
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody AddBookRequest request) {
        Book savedBook = bookService.addBook(request);
        return ResponseEntity.ok(savedBook);
    }

    // NOT: Eski "/fetch/{isbn}" metodunu sildik çünkü artık yukarıdaki
    // createBook metodu, JSON içinde ISBN gelirse o işi zaten yapıyor.
}