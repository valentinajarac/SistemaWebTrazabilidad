package com.trazafrutas.dto.admin;

import com.trazafrutas.model.Crop;
import com.trazafrutas.model.enums.CropStatus;
import com.trazafrutas.model.enums.ProductType;
import lombok.Data;

@Data
public class AdminCropDTO {
    private Long id;
    private String productor;
    private Integer numeroPlants;
    private Double hectareas;
    private ProductType producto;
    private CropStatus estado;
    private String fincaNombre;

    public static AdminCropDTO fromEntity(Crop crop) {
        AdminCropDTO dto = new AdminCropDTO();
        dto.setId(crop.getId());
        dto.setProductor(crop.getUser().getNombreCompleto());
        dto.setNumeroPlants(crop.getNumeroPlants());
        dto.setHectareas(crop.getHectareas());
        dto.setProducto(crop.getProducto());
        dto.setEstado(crop.getEstado());
        dto.setFincaNombre(crop.getFarm().getNombre());
        return dto;
    }
}

