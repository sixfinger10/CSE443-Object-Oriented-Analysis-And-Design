package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Book;
import com.visionsoft.plms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // ✅ YENİ EKLEME: Kullanıcının tüm kitaplarını getir
    List<Book> findByUserId(Long userId);
    
    // User nesnesi ile arama yapar
    Optional<Book> findByIsbnAndUser(String isbn, User user);

    // User ID'ye göre kitap sayısını getirir
    @Query("SELECT COUNT(b) FROM Book b WHERE b.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // User ID ve ISBN'e göre liste getirir (Duplicate kontrolü için)
    @Query("SELECT b FROM Book b WHERE b.user.id = :userId AND b.isbn = :isbn")
    List<Book> findByUserIdAndIsbn(@Param("userId") Long userId, @Param("isbn") String isbn);

    // User ID, Başlık ve Yazara göre liste getirir
    @Query("SELECT b FROM Book b WHERE b.user.id = :userId AND b.title = :title AND b.author = :author")
    List<Book> findByUserIdAndTitleAndAuthor(@Param("userId") Long userId,
                                             @Param("title") String title,
                                             @Param("author") String author);
}