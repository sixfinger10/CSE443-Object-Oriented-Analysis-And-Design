package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Duplicate check için
    List<Book> findByUserIdAndIsbn(Long userId, String isbn);
    
    @Query("SELECT b FROM Book b WHERE b.user.id = :userId AND b.title = :title AND b.author = :author")
    List<Book> findByUserIdAndTitleAndAuthor(@Param("userId") Long userId, @Param("title") String title, @Param("author") String author);
}