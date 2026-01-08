package com.visionsoft.plms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.visionsoft.plms.dto.auth.LibraryItemDTO;
import com.visionsoft.plms.entity.*;
import com.visionsoft.plms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ImportExportService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LibraryItemRepository libraryItemRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private MusicRepository musicRepository;
    
    @Autowired
    private TVSeriesRepository tvSeriesRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Export user's library as JSON - Database'den çek
    public String exportLibraryAsJson(Long userId) throws Exception {
        List<LibraryItem> items = libraryItemRepository.findByUserId(userId);
        List<LibraryItemDTO> dtos = convertToDTO(items);
        return objectMapper.writeValueAsString(dtos);
    }
    
    // Export user's library as CSV - Database'den çek
    public String exportLibraryAsCsv(Long userId) {
        List<LibraryItem> items = libraryItemRepository.findByUserId(userId);
        List<LibraryItemDTO> dtos = convertToDTO(items);
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Title,Description,Type,Status,Rating,Favorite,Author,ISBN,Director,Artist,Platform,Date Added\n");
        
        for (LibraryItemDTO item : dtos) {
            csv.append(escapeCSV(String.valueOf(item.getId()))).append(",")
               .append(escapeCSV(item.getTitle())).append(",")
               .append(escapeCSV(item.getDescription())).append(",")
               .append(escapeCSV(String.valueOf(item.getType()))).append(",")
               .append(escapeCSV(String.valueOf(item.getStatus()))).append(",")
               .append(escapeCSV(String.valueOf(item.getRating()))).append(",")
               .append(item.isFavorite()).append(",")
               .append(escapeCSV(item.getAuthor())).append(",")
               .append(escapeCSV(item.getIsbn())).append(",")
               .append(escapeCSV(item.getDirector())).append(",")
               .append(escapeCSV(item.getArtist())).append(",")
               .append(escapeCSV(item.getPlatform())).append(",")
               .append(escapeCSV(String.valueOf(item.getDateAdded()))).append("\n");
        }
        
        return csv.toString();
    }
    
    // Convert LibraryItem entities to DTOs
    private List<LibraryItemDTO> convertToDTO(List<LibraryItem> items) {
        List<LibraryItemDTO> dtos = new ArrayList<>();
        
        for (LibraryItem item : items) {
            LibraryItemDTO dto = new LibraryItemDTO();
            dto.setId(item.getId());
            dto.setUserId(item.getUser().getId());
            dto.setTitle(item.getTitle());
            dto.setDescription(item.getDescription());
            dto.setImageUrl(item.getImageUrl());
            dto.setType(item.getType());
            dto.setStatus(item.getStatus());
            dto.setRating(item.getRating());
            dto.setFavorite(item.isFavorite());
            dto.setDateAdded(item.getDateAdded());
            
            // Type-specific fields
            if (item instanceof Book) {
                Book book = (Book) item;
                dto.setAuthor(book.getAuthor());
                dto.setIsbn(book.getIsbn());
                dto.setPageCount(book.getPageCount());
            } else if (item instanceof Movie) {
                Movie movie = (Movie) item;
                dto.setDirector(movie.getDirector());
                dto.setDuration(movie.getDurationMinutes());
                dto.setReleaseYear(movie.getReleaseYear());
            } else if (item instanceof Music) {
                Music music = (Music) item;
                dto.setArtist(music.getArtist());
                dto.setAlbum(music.getAlbum());
                dto.setTrackCount(music.getTrackCount());
            } else if (item instanceof TVSeries) {
                TVSeries tvSeries = (TVSeries) item;
                dto.setDirector(tvSeries.getCreator());
            }
            
            dtos.add(dto);
        }
        
        return dtos;
    }
    
    // Import library from JSON and save to database (with duplicate check)
    @Transactional
    public List<LibraryItemDTO> importLibraryFromJson(Long userId, String jsonData) throws Exception {
        List<LibraryItemDTO> dtos = objectMapper.readValue(
            jsonData, 
            objectMapper.getTypeFactory().constructCollectionType(List.class, LibraryItemDTO.class)
        );
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        List<LibraryItemDTO> savedItems = new ArrayList<>();
        
        for (LibraryItemDTO dto : dtos) {
            LibraryItem savedItem = null;
            
            // Type'a göre doğru entity'yi oluştur veya bul
            switch (dto.getType()) {
                case BOOK:
                    Book book = null;
                    
                    // ISBN varsa, ISBN'e göre kontrol et
                    if (dto.getIsbn() != null && !dto.getIsbn().isEmpty()) {
                        List<Book> existingBooks = bookRepository.findByUserIdAndIsbn(user.getId(), dto.getIsbn());
                        if (!existingBooks.isEmpty()) {
                            book = existingBooks.get(0);
                            System.out.println("=== DUPLICATE FOUND (ISBN): " + dto.getIsbn() + " - Updating ID: " + book.getId() + " ===");
                        }
                    }
                    
                    // ISBN yoksa veya bulunamadıysa, Title + Author'a göre kontrol et
                    if (book == null && dto.getTitle() != null && dto.getAuthor() != null) {
                        List<Book> existingBooks = bookRepository.findByUserIdAndTitleAndAuthor(
                            user.getId(), dto.getTitle(), dto.getAuthor()
                        );
                        if (!existingBooks.isEmpty()) {
                            book = existingBooks.get(0);
                            System.out.println("=== DUPLICATE FOUND (Title+Author): " + dto.getTitle() + " - Updating ID: " + book.getId() + " ===");
                        }
                    }
                    
                    // Hala bulunamadıysa, yeni kayıt oluştur
                    if (book == null) {
                        book = new Book();
                        System.out.println("=== NEW BOOK: " + dto.getTitle() + " ===");
                    }
                    
                    // User'ı set et (sadece yeni kayıtlarda)
                    if (book.getUser() == null) {
                        book.setUser(user);
                    }
                    
                    // Tüm field'ları güncelle
                    book.setTitle(dto.getTitle());
                    book.setDescription(dto.getDescription());
                    book.setImageUrl(dto.getImageUrl());
                    book.setStatus(dto.getStatus());
                    book.setRating(dto.getRating());
                    book.setFavorite(dto.isFavorite());
                    book.setAuthor(dto.getAuthor());
                    book.setIsbn(dto.getIsbn());
                    book.setPageCount(dto.getPageCount());
                    
                    savedItem = bookRepository.save(book);
                    break;
                    
                case MOVIE:
                    Movie movie = null;
                    
                    // Title + Director'a göre kontrol et
                    if (dto.getTitle() != null && dto.getDirector() != null) {
                        List<Movie> existingMovies = movieRepository.findByUserIdAndTitleAndDirector(
                            user.getId(), dto.getTitle(), dto.getDirector()
                        );
                        if (!existingMovies.isEmpty()) {
                            movie = existingMovies.get(0);
                            System.out.println("=== DUPLICATE FOUND (Movie): " + dto.getTitle() + " - Updating ID: " + movie.getId() + " ===");
                        }
                    }
                    
                    // Bulunamadıysa, yeni kayıt oluştur
                    if (movie == null) {
                        movie = new Movie();
                        System.out.println("=== NEW MOVIE: " + dto.getTitle() + " ===");
                    }
                    
                    // User'ı set et (sadece yeni kayıtlarda)
                    if (movie.getUser() == null) {
                        movie.setUser(user);
                    }
                    
                    // Tüm field'ları güncelle
                    movie.setTitle(dto.getTitle());
                    movie.setDescription(dto.getDescription());
                    movie.setImageUrl(dto.getImageUrl());
                    movie.setStatus(dto.getStatus());
                    movie.setRating(dto.getRating());
                    movie.setFavorite(dto.isFavorite());
                    movie.setDirector(dto.getDirector());
                    movie.setDurationMinutes(dto.getDuration());
                    movie.setReleaseYear(dto.getReleaseYear());
                    
                    savedItem = movieRepository.save(movie);
                    break;
                    
                case MUSIC:
                    Music music = null;
                    
                    // Title + Artist'e göre kontrol et
                    if (dto.getTitle() != null && dto.getArtist() != null) {
                        List<Music> existingMusic = musicRepository.findByUserIdAndTitleAndArtist(
                            user.getId(), dto.getTitle(), dto.getArtist()
                        );
                        if (!existingMusic.isEmpty()) {
                            music = existingMusic.get(0);
                            System.out.println("=== DUPLICATE FOUND (Music): " + dto.getTitle() + " - Updating ID: " + music.getId() + " ===");
                        }
                    }
                    
                    // Bulunamadıysa, yeni kayıt oluştur
                    if (music == null) {
                        music = new Music();
                        System.out.println("=== NEW MUSIC: " + dto.getTitle() + " ===");
                    }
                    
                    // User'ı set et (sadece yeni kayıtlarda)
                    if (music.getUser() == null) {
                        music.setUser(user);
                    }
                    
                    // Tüm field'ları güncelle
                    music.setTitle(dto.getTitle());
                    music.setDescription(dto.getDescription());
                    music.setImageUrl(dto.getImageUrl());
                    music.setStatus(dto.getStatus());
                    music.setRating(dto.getRating());
                    music.setFavorite(dto.isFavorite());
                    music.setArtist(dto.getArtist());
                    music.setAlbum(dto.getAlbum());
                    music.setTrackCount(dto.getTrackCount());
                    
                    savedItem = musicRepository.save(music);
                    break;
                    
                case TV_SERIES:
                    TVSeries tvSeries = null;
                    
                    // Title + Creator'a göre kontrol et
                    if (dto.getTitle() != null && dto.getDirector() != null) {
                        List<TVSeries> existingSeries = tvSeriesRepository.findByUserIdAndTitleAndCreator(
                            user.getId(), dto.getTitle(), dto.getDirector()
                        );
                        if (!existingSeries.isEmpty()) {
                            tvSeries = existingSeries.get(0);
                            System.out.println("=== DUPLICATE FOUND (TVSeries): " + dto.getTitle() + " - Updating ID: " + tvSeries.getId() + " ===");
                        }
                    }
                    
                    // Bulunamadıysa, yeni kayıt oluştur
                    if (tvSeries == null) {
                        tvSeries = new TVSeries();
                        System.out.println("=== NEW TV SERIES: " + dto.getTitle() + " ===");
                    }
                    
                    // User'ı set et (sadece yeni kayıtlarda)
                    if (tvSeries.getUser() == null) {
                        tvSeries.setUser(user);
                    }
                    
                    // Tüm field'ları güncelle
                    tvSeries.setTitle(dto.getTitle());
                    tvSeries.setDescription(dto.getDescription());
                    tvSeries.setImageUrl(dto.getImageUrl());
                    tvSeries.setStatus(dto.getStatus());
                    tvSeries.setRating(dto.getRating());
                    tvSeries.setFavorite(dto.isFavorite());
                    tvSeries.setCreator(dto.getDirector());
                    
                    savedItem = tvSeriesRepository.save(tvSeries);
                    break;
                    
                default:
                    throw new RuntimeException("Unknown item type: " + dto.getType());
            }
            
            // Kaydedilen item'ı DTO'ya çevir
            if (savedItem != null) {
                LibraryItemDTO savedDto = new LibraryItemDTO();
                savedDto.setId(savedItem.getId());
                savedDto.setUserId(savedItem.getUser().getId());
                savedDto.setTitle(savedItem.getTitle());
                savedDto.setDescription(savedItem.getDescription());
                savedDto.setType(savedItem.getType());
                savedDto.setStatus(savedItem.getStatus());
                savedDto.setRating(savedItem.getRating());
                savedDto.setFavorite(savedItem.isFavorite());
                savedDto.setDateAdded(savedItem.getDateAdded());
                savedItems.add(savedDto);
            }
        }
        
        return savedItems;
    }
    
    // Sync library items (for offline sync)
    @Transactional
    public SyncResult syncLibrary(Long userId, List<SyncOperation> operations) {
        SyncResult result = new SyncResult();
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            result.setSuccess(false);
            result.setMessage("User not found");
            return result;
        }
        
        for (SyncOperation op : operations) {
            try {
                switch (op.getType()) {
                    case "ADD":
                        result.incrementAdded();
                        result.addItemToProcess(op.getItem());
                        break;
                        
                    case "UPDATE":
                        result.incrementUpdated();
                        result.addItemToProcess(op.getItem());
                        break;
                        
                    case "DELETE":
                        result.incrementDeleted();
                        result.addDeletedItemId(op.getItemId());
                        break;
                }
            } catch (Exception e) {
                result.addError("Operation failed: " + e.getMessage());
            }
        }
        
        result.setSuccess(true);
        result.setMessage("Sync completed");
        return result;
    }
    
    // Helper: Escape CSV values
    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
    
    // Inner classes for Sync
    public static class SyncOperation {
        private String type; // ADD, UPDATE, DELETE
        private Long itemId;
        private LibraryItemDTO item;
        
        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        
        public LibraryItemDTO getItem() { return item; }
        public void setItem(LibraryItemDTO item) { this.item = item; }
    }
    
    public static class SyncResult {
        private boolean success;
        private String message;
        private int added = 0;
        private int updated = 0;
        private int deleted = 0;
        private List<String> errors = new ArrayList<>();
        private List<LibraryItemDTO> itemsToProcess = new ArrayList<>();
        private List<Long> deletedItemIds = new ArrayList<>();
        
        public void incrementAdded() { added++; }
        public void incrementUpdated() { updated++; }
        public void incrementDeleted() { deleted++; }
        public void addError(String error) { errors.add(error); }
        public void addItemToProcess(LibraryItemDTO item) { itemsToProcess.add(item); }
        public void addDeletedItemId(Long id) { deletedItemIds.add(id); }
        
        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public int getAdded() { return added; }
        public int getUpdated() { return updated; }
        public int getDeleted() { return deleted; }
        public List<String> getErrors() { return errors; }
        public List<LibraryItemDTO> getItemsToProcess() { return itemsToProcess; }
        public List<Long> getDeletedItemIds() { return deletedItemIds; }
    }
}