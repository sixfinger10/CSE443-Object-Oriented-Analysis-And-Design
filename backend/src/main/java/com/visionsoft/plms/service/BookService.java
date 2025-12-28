package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository; // User'ı bulmak için lazım
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // Metot imzasını değiştirdik: Artık userId istiyoruz
    public Book saveBookByIsbn(String isbn, Long userId) {

        // 0. Kullanıcıyı bul (Yoksa hata fırlat)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı ID: " + userId));

        // 1. Önce veritabanına bak: Bu kullanıcı bu kitabı zaten eklemiş mi?
        // NOT: Global bir kontrol yerine, o kullanıcının kütüphanesinde var mı diye bakmak daha doğru olabilir.
        // Ama şimdilik ISBN kontrolü kalsın.
        var existingBook = bookRepository.findByIsbn(isbn);
        if (existingBook.isPresent()) {
            return existingBook.get();
        }

        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (root.path("totalItems").asInt() == 0) {
                throw new RuntimeException("Bu ISBN ile kayıtlı kitap bulunamadı: " + isbn);
            }

            JsonNode volumeInfo = root.path("items").get(0).path("volumeInfo");

            Book book = new Book();
            book.setUser(user); // <--- KRİTİK DÜZELTME: Kitabın sahibini atadık
            book.setIsbn(isbn);
            book.setTitle(volumeInfo.path("title").asText());

            if (volumeInfo.has("authors")) {
                book.setAuthor(volumeInfo.path("authors").get(0).asText());
            }

            if (volumeInfo.has("publishedDate")) {
                String date = volumeInfo.path("publishedDate").asText();
                // Google bazen sadece "2005" döner, bazen "2005-10-10". Hata almamak için:
                if (date.length() >= 4) {
                    book.setPublicationYear(Integer.parseInt(date.substring(0, 4)));
                }
            }

            // Sayfa Sayısı (Entity'de vardı, ekleyelim)
            if (volumeInfo.has("pageCount")) {
                book.setPageCount(volumeInfo.path("pageCount").asInt());
            }

            // Kapak Resmi (Entity'de vardı, ekleyelim)
            if (volumeInfo.has("imageLinks")) {
                // thumbnail veya smallThumbnail alalım
                JsonNode images = volumeInfo.path("imageLinks");
                if (images.has("thumbnail")) {
                    book.setImageUrl(images.path("thumbnail").asText());
                } else if (images.has("smallThumbnail")) {
                    book.setImageUrl(images.path("smallThumbnail").asText());
                }
            }

            if (volumeInfo.has("categories")) {
                book.setGenre(volumeInfo.path("categories").get(0).asText());
            }

            if (volumeInfo.has("description")) {
                String desc = volumeInfo.path("description").asText();
                book.setDescription(desc.length() > 2000 ? desc.substring(0, 2000) : desc);
            }

            return bookRepository.save(book);

        } catch (Exception e) {
            e.printStackTrace(); // Loglarda hatayı görmek için
            throw new RuntimeException("Google API hatası: " + e.getMessage());
        }
    }
}