package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    // "Bana şu ISBN'e sahip kitabı bul (Varsa kutu içinde getir, yoksa boş getir)"
    Optional<Book> findByIsbn(String isbn);
}