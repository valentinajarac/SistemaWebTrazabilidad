package com.trazafrutas.dto;

import com.trazafrutas.model.enums.CropStatus;
import com.trazafrutas.model.enums.ProductType;
import lombok.Data;

@Data
public class CropDTO {
    private Long id;
    private Integer numeroPlants;
    private Double hectareas;
    private ProductType producto;
    private CropStatus estado;
    private Long farmId;
    private Long userId;
}