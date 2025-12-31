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
@Table(name = "music")
@PrimaryKeyJoinColumn(name = "id")
public class Music extends LibraryItem {

    private String artist;
    private String album;
    private String genre;
    private Integer durationSeconds;
    private Integer trackCount;
    private Integer releaseYear;

    // Last.fm Unique ID (Varsa)
    private String mbid;

    public Music() {
        this.type = ItemType.MUSIC;
    }
}