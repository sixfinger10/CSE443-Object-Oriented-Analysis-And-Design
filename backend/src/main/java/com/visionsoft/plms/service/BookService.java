package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddBookRequest;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.entity.enums.ItemType;
import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // Yardımcı Metot: ID'den kullanıcıyı bul
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("HATA: ID'si " + userId + " olan kullanıcı bulunamadı!"));
    }

    // --- ANA METOT (Controller Burayı Çağırır) ---
    public Book addBook(AddBookRequest request, Long userId) {
        // ISBN varsa Google API akışı
        if (request.getIsbn() != null && !request.getIsbn().isEmpty()) {
            return saveBookByIsbn(request.getIsbn(), userId);
        }
        // ISBN yoksa Manuel akış
        else {
            Book book = new Book();
            book.setUser(getUserById(userId)); // Dinamik kullanıcı
            book.setType(ItemType.BOOK);
            book.setStatus(ItemStatus.WISHLIST);

            book.setTitle(request.getTitle());
            book.setDescription(request.getDescription() != null ? request.getDescription() : "Manuel eklendi.");
            book.setAuthor(request.getAuthor());
            book.setPublisher(request.getPublisher());
            book.setPublicationYear(request.getPublicationYear());
            book.setPageCount(request.getPageCount());
            book.setGenre(request.getGenre());

            return bookRepository.save(book);
        }
    }

    // --- GOOGLE API METODU ---
    public Book saveBookByIsbn(String isbn, Long userId) {

        User currentUser = getUserById(userId);

        // 1. KONTROL: Sadece BU kullanıcının kütüphanesine bakıyoruz.
        // Başkasında olup olmaması bizi ilgilendirmiyor.
        var existingBook = bookRepository.findByIsbnAndUser(isbn, currentUser);

        if (existingBook.isPresent()) {
            // Zaten varsa aynısını dön (Duplicate yok)
            return existingBook.get();
        }

        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (root.path("totalItems").asInt() == 0) {
                throw new RuntimeException("Google'da bu kitap bulunamadı: " + isbn);
            }

            JsonNode volumeInfo = root.path("items").get(0).path("volumeInfo");

            Book book = new Book();

            // Kullanıcıyı Ata
            book.setUser(currentUser);

            book.setType(ItemType.BOOK);
            book.setStatus(ItemStatus.WISHLIST);
            book.setIsbn(isbn);
            book.setTitle(volumeInfo.path("title").asText());

            if (volumeInfo.has("authors")) book.setAuthor(volumeInfo.path("authors").get(0).asText());
            if (volumeInfo.has("publishedDate")) {
                String date = volumeInfo.path("publishedDate").asText();
                if(date.length() >= 4) book.setPublicationYear(Integer.parseInt(date.substring(0, 4)));
            }
            if (volumeInfo.has("categories")) book.setGenre(volumeInfo.path("categories").get(0).asText());
            if (volumeInfo.has("description")) {
                String desc = volumeInfo.path("description").asText();
                book.setDescription(desc.length() > 2000 ? desc.substring(0, 2000) + "..." : desc);
            }
            if (volumeInfo.has("pageCount")) book.setPageCount(volumeInfo.path("pageCount").asInt());
            if (volumeInfo.has("publisher")) book.setPublisher(volumeInfo.path("publisher").asText());

            // Resim Alma
            if (volumeInfo.has("imageLinks")) {
                JsonNode images = volumeInfo.path("imageLinks");
                if (images.has("thumbnail")) {
                    book.setImageUrl(images.path("thumbnail").asText());
                } else if (images.has("smallThumbnail")) {
                    book.setImageUrl(images.path("smallThumbnail").asText());
                }
            }

            return bookRepository.save(book);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Hata: " + e.getMessage());
        }
    }
}