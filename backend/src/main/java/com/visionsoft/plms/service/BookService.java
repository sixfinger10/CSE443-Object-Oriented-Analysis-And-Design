package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.AddBookRequest;
import com.visionsoft.plms.dto.UpdateBookRequest;
import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.entity.enums.ItemType;
import com.visionsoft.plms.entity.enums.ItemStatus;
import com.visionsoft.plms.repository.BookRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Iterator;
import java.util.Optional;

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

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("HATA: ID'si " + userId + " olan kullanıcı bulunamadı!"));
    }

    // --- AKILLI EKLEME METODU ---
    public Book addBook(AddBookRequest request, Long userId) {

        // DURUM 1: Kullanıcı ISBN girmiş
        if (request.getIsbn() != null && !request.getIsbn().isEmpty()) {
            // --- GÜNCELLENDİ: Favorite bilgisini de gönderiyoruz ---
            return saveBookByIsbn(request.getIsbn(), userId, request.getFavorite());
        }

        // DURUM 2: Kullanıcı ISBN girmemiş (İsimden Arama)
        else {
            User currentUser = getUserById(userId);

            // A. Başlangıç Kontrolü (Kullanıcının girdiği isme göre)
            var existingBooks = bookRepository.findByUserIdAndTitleAndAuthor(
                    userId, request.getTitle(), request.getAuthor()
            );
            if (!existingBooks.isEmpty()) {
                return existingBooks.get(0);
            }

            // B. Google API'de Ara ve En İyisini Seç
            Book bookToSave = new Book();
            boolean foundInGoogle = false;

            try {
                String searchQuery = "intitle:" + request.getTitle().replace(" ", "+");
                if (request.getAuthor() != null && !request.getAuthor().isEmpty()) {
                    searchQuery += "+inauthor:" + request.getAuthor().replace(" ", "+");
                }

                // maxResults=20 yaptık ki seçme havuzumuz geniş olsun
                String url = "https://www.googleapis.com/books/v1/volumes?q=" + searchQuery + "&maxResults=20";
                String jsonResponse = restTemplate.getForObject(url, String.class);
                JsonNode root = objectMapper.readTree(jsonResponse);

                if (root.path("totalItems").asInt() > 0) {

                    // --- EN İYİ KİTABI SEÇEN ALGORİTMAYI ÇAĞIRIYORUZ ---
                    JsonNode bestItem = findBestMatch(root.path("items"));
                    JsonNode volumeInfo = bestItem.path("volumeInfo");

                    bookToSave.setTitle(volumeInfo.path("title").asText());

                    // ISBN Çekme Mantığı
                    String isbnToSave = null;
                    if (volumeInfo.has("industryIdentifiers")) {
                        for (JsonNode idNode : volumeInfo.path("industryIdentifiers")) {
                            String type = idNode.path("type").asText();
                            String identifier = idNode.path("identifier").asText();

                            if ("ISBN_13".equals(type)) {
                                isbnToSave = identifier;
                                break;
                            } else if ("ISBN_10".equals(type) && isbnToSave == null) {
                                isbnToSave = identifier;
                            }
                        }
                    }
                    bookToSave.setIsbn(isbnToSave);

                    if (volumeInfo.has("authors")) bookToSave.setAuthor(volumeInfo.path("authors").get(0).asText());

                    if (volumeInfo.has("publishedDate")) {
                        String date = volumeInfo.path("publishedDate").asText();
                        if(date.length() >= 4) bookToSave.setPublicationYear(Integer.parseInt(date.substring(0, 4)));
                    }

                    if (volumeInfo.has("pageCount")) bookToSave.setPageCount(volumeInfo.path("pageCount").asInt());
                    if (volumeInfo.has("publisher")) bookToSave.setPublisher(volumeInfo.path("publisher").asText());
                    if (volumeInfo.has("categories")) bookToSave.setGenre(volumeInfo.path("categories").get(0).asText());

                    // Açıklama Karakter Sınırı (DB patlamasın diye)
                    if (volumeInfo.has("description")) {
                        String desc = volumeInfo.path("description").asText();
                        bookToSave.setDescription(desc.length() > 2000 ? desc.substring(0, 1995) + "..." : desc);
                    }

                    if (volumeInfo.has("imageLinks")) {
                        JsonNode images = volumeInfo.path("imageLinks");
                        if (images.has("thumbnail")) bookToSave.setImageUrl(images.path("thumbnail").asText());
                        else if (images.has("smallThumbnail")) bookToSave.setImageUrl(images.path("smallThumbnail").asText());
                    }

                    foundInGoogle = true;
                }

            } catch (Exception e) {
                System.out.println("Google API hatası (Manuel devam ediliyor): " + e.getMessage());
            }

            // C. Kullanıcı Verilerini Set Et
            bookToSave.setUser(currentUser);
            bookToSave.setType(ItemType.BOOK);
            bookToSave.setStatus(ItemStatus.WISHLIST);

            // --- YENİ EKLENEN: Favorite Durumu ---
            bookToSave.setFavorite(request.getFavorite() != null ? request.getFavorite() : false);

            // Google bulamadıysa kullanıcının girdiklerini kullan
            if (!foundInGoogle || bookToSave.getTitle() == null) bookToSave.setTitle(request.getTitle());
            if (!foundInGoogle || bookToSave.getAuthor() == null) bookToSave.setAuthor(request.getAuthor());

            if (request.getDescription() != null) {
                bookToSave.setDescription(request.getDescription());
            } else if (bookToSave.getDescription() == null) {
                bookToSave.setDescription("Manuel eklendi.");
            }

            if (request.getPublisher() != null) bookToSave.setPublisher(request.getPublisher());
            if (request.getPublicationYear() != null) bookToSave.setPublicationYear(request.getPublicationYear());
            if (request.getPageCount() != null) bookToSave.setPageCount(request.getPageCount());
            if (request.getGenre() != null) bookToSave.setGenre(request.getGenre());

            // --- GÜVENLİK KİLİDİ (SON KONTROL) ---
            if (bookToSave.getIsbn() != null) {
                Optional<Book> duplicateIsbnCheck = bookRepository.findByIsbnAndUser(bookToSave.getIsbn(), currentUser);
                if (duplicateIsbnCheck.isPresent()) {
                    return duplicateIsbnCheck.get();
                }
            }

            return bookRepository.save(bookToSave);
        }
    }

    // --- EN İYİ KİTABI SEÇME ALGORİTMASI (Weighted Scoring) ---
    private JsonNode findBestMatch(JsonNode items) {
        JsonNode bestItem = items.get(0); // Varsayılan ilk kayıt
        int maxScore = -1;

        Iterator<JsonNode> elements = items.elements();
        while (elements.hasNext()) {
            JsonNode item = elements.next();
            JsonNode volumeInfo = item.path("volumeInfo");

            int score = 0;

            // 1. ISBN Puanı
            boolean hasIsbn = false;
            if (volumeInfo.has("industryIdentifiers")) {
                for (JsonNode id : volumeInfo.path("industryIdentifiers")) {
                    String type = id.path("type").asText();
                    if ("ISBN_13".equals(type) || "ISBN_10".equals(type)) {
                        hasIsbn = true;
                        break;
                    }
                }
            }
            if (hasIsbn) score += 100;

            // 2. Kapak Resmi Puanı
            if (volumeInfo.has("imageLinks") && volumeInfo.path("imageLinks").has("thumbnail")) {
                score += 50;
            }

            // 3. Dil Puanı (Türkçe ise öncelik ver)
            if (volumeInfo.has("language") && "tr".equalsIgnoreCase(volumeInfo.path("language").asText())) {
                score += 40;
            }

            // 4. Açıklama Puanı
            if (volumeInfo.has("description") && !volumeInfo.path("description").asText().isEmpty()) {
                score += 20;
            }

            // 5. Yayın Yılı Puanı
            if (volumeInfo.has("publishedDate")) {
                score += 10;
            }

            if (score > maxScore) {
                maxScore = score;
                bestItem = item;
            }
        }

        return bestItem;
    }

    // --- SADECE ISBN İLE EKLEME (API) ---
    // --- GÜNCELLENDİ: Boolean isFavorite parametresi eklendi ---
    public Book saveBookByIsbn(String isbn, Long userId, Boolean isFavorite) {
        User currentUser = getUserById(userId);

        var existingBook = bookRepository.findByIsbnAndUser(isbn, currentUser);
        if (existingBook.isPresent()) return existingBook.get();

        String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (root.path("totalItems").asInt() == 0) {
                throw new RuntimeException("Google'da bu kitap bulunamadı: " + isbn);
            }

            JsonNode volumeInfo = root.path("items").get(0).path("volumeInfo");
            Book book = new Book();

            book.setUser(currentUser);
            book.setType(ItemType.BOOK);
            book.setStatus(ItemStatus.WISHLIST);

            // --- YENİ EKLENEN: Favorite Durumu ---
            book.setFavorite(isFavorite != null ? isFavorite : false);

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
                book.setDescription(desc.length() > 2000 ? desc.substring(0, 1995) + "..." : desc);
            }

            if (volumeInfo.has("pageCount")) book.setPageCount(volumeInfo.path("pageCount").asInt());
            if (volumeInfo.has("publisher")) book.setPublisher(volumeInfo.path("publisher").asText());

            if (volumeInfo.has("imageLinks")) {
                JsonNode images = volumeInfo.path("imageLinks");
                if (images.has("thumbnail")) book.setImageUrl(images.path("thumbnail").asText());
                else if (images.has("smallThumbnail")) book.setImageUrl(images.path("smallThumbnail").asText());
            }

            return bookRepository.save(book);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Hata: " + e.getMessage());
        }
    }

    // --- SİLME METODU ---
    public void deleteBook(Long bookId, Long userId) {
        // 1. Kitabı bul, yoksa hata ver
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Silinecek kitap bulunamadı (ID: " + bookId + ")"));

        // 2. Güvenlik Kontrolü: Bu kitap gerçekten silmek isteyen kullanıcıya mı ait?
        if (!book.getUser().getId().equals(userId)) {
            throw new RuntimeException("HATA: Bu kitabı silme yetkiniz yok! Sadece kendi kitaplarınızı silebilirsiniz.");
        }

        // 3. Silme İşlemi
        bookRepository.delete(book);
    }

    // --- GÜNCELLEME METODU ---
    public Book updateBook(Long bookId, UpdateBookRequest request, Long userId) {
        // 1. Kitabı bul
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadı (ID: " + bookId + ")"));

        // 2. Yetki Kontrolü (Sadece sahibi güncelleyebilir)
        if (!book.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bu kitabı güncelleme yetkiniz yok!");
        }

        // 3. Güncelleme (Sadece dolu gelen alanları değiştir)

        // --- Ortak Alanlar ---
        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getDescription() != null) book.setDescription(request.getDescription());
        if (request.getFavorite() != null) book.setFavorite(request.getFavorite());
        if (request.getStatus() != null) book.setStatus(request.getStatus());
        // .intValue() ekleyerek Double'ı Integer'a çeviriyoruz
        if (request.getRating() != null) book.setRating(request.getRating().intValue());
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());

        // --- Kitaba Özel Alanlar ---
        if (request.getAuthor() != null) book.setAuthor(request.getAuthor());
        if (request.getPublisher() != null) book.setPublisher(request.getPublisher());
        if (request.getPageCount() != null) book.setPageCount(request.getPageCount());

        // 4. Kaydet ve Döndür
        return bookRepository.save(book);
    }
}