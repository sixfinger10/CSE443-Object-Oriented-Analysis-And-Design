package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    // İleride "Yazara göre bul" gibi özel metodları buraya yazacağız.
}