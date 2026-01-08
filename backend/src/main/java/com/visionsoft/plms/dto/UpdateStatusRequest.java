package com.visionsoft.plms.dto;

import com.visionsoft.plms.entity.enums.ItemStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private ItemStatus status;
}