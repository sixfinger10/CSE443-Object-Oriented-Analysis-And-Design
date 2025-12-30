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
@Table(name = "movies")
@PrimaryKeyJoinColumn(name = "id")
public class Movie extends LibraryItem {

    private String director;
    private Integer durationMinutes;
    private String imdbId;
    private Double imdbScore;
    private Integer releaseYear;
    private String genre;
    private String castMembers; // Oyuncuları virgülle ayırıp string tutalım

    public Movie() {
  this.type = ItemType.MOVIE;    }
}