package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddBookRequest;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.entity.enums.ItemType; // Enum'ı eklemeyi unutma
import com.visionsoft.plms.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Book addBook(AddBookRequest request) {
        // SENARYO 1: ISBN Doluysa -> Google API mantığını çalıştır
        if (request.getIsbn() != null && !request.getIsbn().isEmpty()) {
            return saveBookByIsbn(request.getIsbn());
        }

        // SENARYO 2: ISBN Boşsa -> Manuel Ekleme Yap
        else {
            Book book = new Book();
            // LibraryItem alanları
            book.setTitle(request.getTitle());
            book.setDescription(request.getDescription() != null ? request.getDescription() : "Manuel olarak eklendi.");
            book.setType(ItemType.BOOK); // Enum ataması önemli!

            // Book alanları
            book.setAuthor(request.getAuthor());
            book.setPublisher(request.getPublisher());
            book.setPublicationYear(request.getPublicationYear());
            book.setPageCount(request.getPageCount());
            book.setGenre(request.getGenre());

            // TODO: User ataması yapılmalı (Şimdilik null veya geçici user)
            // book.setUser(currentUser);

            return bookRepository.save(book);
        }
    }

    public Book saveBookByIsbn(String isbn) {
        // (Eski metodun mantığı aynı kalacak, sadece setType(ItemType.BOOK) ekleyeceğiz)

        // 1. Veritabanı kontrolü (Eski kodundaki gibi)
        // ... (Burayı kısa tutuyorum, eski kodun mantığı aynen geçerli)

        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (root.path("totalItems").asInt() == 0) {
                throw new RuntimeException("Bu ISBN ile kayıtlı kitap bulunamadı: " + isbn);
            }

            JsonNode volumeInfo = root.path("items").get(0).path("volumeInfo");

            Book book = new Book();
            book.setType(ItemType.BOOK); // ÖNEMLİ: Tipini belirtiyoruz

            book.setIsbn(isbn);
            book.setTitle(volumeInfo.path("title").asText());

            if (volumeInfo.has("authors")) {
                book.setAuthor(volumeInfo.path("authors").get(0).asText());
            }

            if (volumeInfo.has("publishedDate")) {
                String date = volumeInfo.path("publishedDate").asText();
                if(date.length() >= 4) {
                    book.setPublicationYear(Integer.parseInt(date.substring(0, 4)));
                }
            }

            if (volumeInfo.has("categories")) {
                book.setGenre(volumeInfo.path("categories").get(0).asText());
            }

            if (volumeInfo.has("description")) {
                String desc = volumeInfo.path("description").asText();
                book.setDescription(desc.length() > 2000 ? desc.substring(0, 2000) + "..." : desc);
            }

            if (volumeInfo.has("pageCount")) {
                book.setPageCount(volumeInfo.path("pageCount").asInt());
            }

            if (volumeInfo.has("publisher")) {
                book.setPublisher(volumeInfo.path("publisher").asText());
            }

            return bookRepository.save(book);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Google API hatası: " + e.getMessage());
        }
    }
}