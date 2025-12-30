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

    private String creator;
    private Integer seasonCount;
    private Integer episodeCount;
    private String network; // HBO, Netflix vb.
    private Integer startYear;
    private Integer endYear; // Devam ediyorsa null olabilir

    public TVSeries() {
    this.type = ItemType.TV_SERIES;
    }
}