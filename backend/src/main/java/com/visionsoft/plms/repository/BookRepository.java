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

    // --- 1. BookService İçin ---
    Optional<Book> findByIsbnAndUser(String isbn, User user);

    // --- 2. Dashboard Controller İçin ---
    @Query("SELECT COUNT(b) FROM Book b WHERE b.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // --- 3. Import/Export Service İçin ---
    
    @Query("SELECT b FROM Book b WHERE b.user.id = :userId AND b.isbn = :isbn")
    List<Book> findByUserIdAndIsbn(@Param("userId") Long userId, @Param("isbn") String isbn);

    @Query("SELECT b FROM Book b WHERE b.user.id = :userId AND b.title = :title AND b.author = :author")
    List<Book> findByUserIdAndTitleAndAuthor(@Param("userId") Long userId,
                                             @Param("title") String title,
                                             @Param("author") String author);
    
    @Query("SELECT b FROM Book b WHERE b.user.id = :userId " +
           "AND b.title = :title " +
           "AND b.author = :author " +
           "AND (b.isbn = :isbn OR (b.isbn IS NULL AND :isbn IS NULL)) " +
           "AND (b.publisher = :publisher OR (b.publisher IS NULL AND :publisher IS NULL)) " +
           "AND (b.pageCount = :pageCount OR (b.pageCount IS NULL AND :pageCount IS NULL)) " +
           "AND (b.language = :language OR (b.language IS NULL AND :language IS NULL)) " +
           "AND (b.genre = :genre OR (b.genre IS NULL AND :genre IS NULL)) " +
           "AND (b.publicationYear = :publicationYear OR (b.publicationYear IS NULL AND :publicationYear IS NULL))")
    List<Book> findExactDuplicate(
        @Param("userId") Long userId,
        @Param("title") String title,
        @Param("author") String author,
        @Param("isbn") String isbn,
        @Param("publisher") String publisher,
        @Param("pageCount") Integer pageCount,
        @Param("language") String language,
        @Param("genre") String genre,
        @Param("publicationYear") Integer publicationYear
    );
}