package com.visionsoft.plms.entity;

import com.visionsoft.plms.entity.enums.ItemType;
import jakarta.persistence.*;

@Entity
@Table(name = "books")
@PrimaryKeyJoinColumn(name = "id")
public class Book extends LibraryItem {

    private String author;
    private String isbn;
    private String publisher;
    private Integer publicationYear;
    private Integer pageCount;
    private String genre;
    private String language;

    public Book() {
        this.type = ItemType.BOOK;
    }

    // Getters and Setters
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}