package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.AddBookRequest;
import com.visionsoft.plms.dto.UpdateBookRequest;
import com.visionsoft.plms.dto.UpdateStatusRequest;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.service.BookService;
import com.visionsoft.plms.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;
    private final BookRepository bookRepository;
    private final JwtUtil jwtUtil;

    public BookController(BookService bookService, BookRepository bookRepository, JwtUtil jwtUtil) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
        this.jwtUtil = jwtUtil;
    }

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

    // CREATE - POST /api/books
    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody AddBookRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Book savedBook = bookService.addBook(request, userId);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            System.err.println("ERROR in createBook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // READ ALL - GET /api/books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            List<Book> books = bookRepository.findByUserId(userId);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            System.err.println("ERROR in getAllBooks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // READ ONE - GET /api/books/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            if (!book.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(book);
        } catch (Exception e) {
            System.err.println("ERROR in getBookById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // UPDATE - PUT /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody UpdateBookRequest request) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Book updatedBook = bookService.updateBook(id, request, userId);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            System.err.println("ERROR in updateBook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // UPDATE STATUS - PATCH /api/books/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Book> updateBookStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            Book updatedBook = bookService.updateBookStatus(id, request.getStatus(), userId);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            System.err.println("ERROR in updateBookStatus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // DELETE - DELETE /api/books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            bookService.deleteBook(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("ERROR in deleteBook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}