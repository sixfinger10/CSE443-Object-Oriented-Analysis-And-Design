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
@Table(name = "tv_series")
@PrimaryKeyJoinColumn(name = "id")
public class TVSeries extends LibraryItem {

    private String creator;      // API'deki "Writer" bilgisi
    private Integer seasonCount; // API'deki "totalSeasons"
    private Integer episodeCount;// API vermezse manuel girilebilir
    private String network;      // HBO, Netflix vb. (Manuel)
    private Integer startYear;   // "2011–2019" -> 2011
    private Integer endYear;     // "2011–2019" -> 2019 (Devam ediyorsa null)

    // OMDb Uyumlu Yeni Alanlar
    private String imdbId;
    private Double imdbScore;
    private String genre;
    private String castMembers;

    public TVSeries() {
        this.type = ItemType.TV_SERIES;
    }
}