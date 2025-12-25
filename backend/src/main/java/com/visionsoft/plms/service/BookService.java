package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {

    private final BookRepository bookRepository;
    // Dış dünyaya (Google'a) istek atacak aracımız
    private final RestTemplate restTemplate;
    // Gelen karışık JSON verisini parçalayacak aracımız
    private final ObjectMapper objectMapper;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Book saveBookByIsbn(String isbn) {
        // 1. Önce veritabanına bak: Bu kitap zaten var mı?
        var existingBook = bookRepository.findByIsbn(isbn);

        // 2. Eğer varsa, Google'a hiç gitme, var olanı geri döndür.
        if (existingBook.isPresent()) {
            return existingBook.get();
        }

        // Google Books API Adresi
        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        try {
            // 1. İsteği at ve cevabı al
            String jsonResponse = restTemplate.getForObject(url, String.class);

            // 2. Cevabı oku
            JsonNode root = objectMapper.readTree(jsonResponse);

            // 3. Kitap bulundu mu kontrol et
            if (root.path("totalItems").asInt() == 0) {
                throw new RuntimeException("Bu ISBN ile kayıtlı kitap bulunamadı: " + isbn);
            }

            // 4. İlk kitabı seç (items listesinin 0. elemanı)
            JsonNode volumeInfo = root.path("items").get(0).path("volumeInfo");

            // 5. Verileri ayıkla ve Book nesnesine doldur
            Book book = new Book();
            book.setIsbn(isbn);
            book.setTitle(volumeInfo.path("title").asText());

            if (volumeInfo.has("authors")) {
                book.setAuthor(volumeInfo.path("authors").get(0).asText());
            }

            if (volumeInfo.has("publishedDate")) {
                String date = volumeInfo.path("publishedDate").asText();
                // Sadece yılı al (Örn: 2005-01-01 -> 2005)
                book.setPublicationYear(Integer.parseInt(date.substring(0, 4)));
            }

            // Kategorileri (Genre) al
            if (volumeInfo.has("categories")) {
                book.setGenre(volumeInfo.path("categories").get(0).asText());
            }

            if (volumeInfo.has("description")) {
                String desc = volumeInfo.path("description").asText();
                // Açıklama çok uzunsa ilk 250 karakteri al
                book.setDescription(desc.length() > 250 ? desc.substring(0, 250) + "..." : desc);
            }

            // 6. Veritabanına kaydet
            return bookRepository.save(book);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Google API hatası: " + e.getMessage());
        }
    }
}