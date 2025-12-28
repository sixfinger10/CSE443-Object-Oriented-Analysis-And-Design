package com.visionsoft.plms.entity;

import com.visionsoft.plms.entity.enums.ItemType;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
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
        this.setType(ItemType.BOOK);
    }
}