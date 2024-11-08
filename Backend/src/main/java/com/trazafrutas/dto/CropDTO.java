package com.trazafrutas.dto;

import com.trazafrutas.model.Crop;
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
    private String farmNombre;  // Añadido para mostrar el nombre de la finca
    private Long userId;

    public static CropDTO fromEntity(Crop crop) {
        CropDTO dto = new CropDTO();
        dto.setId(crop.getId());
        dto.setNumeroPlants(crop.getNumeroPlants());
        dto.setHectareas(crop.getHectareas());
        dto.setProducto(crop.getProducto());
        dto.setEstado(crop.getEstado());

        // Asegurarnos de incluir la información de la finca
        if (crop.getFarm() != null) {
            dto.setFarmId(crop.getFarm().getId());
            dto.setFarmNombre(crop.getFarm().getNombre());
        }

        if (crop.getUser() != null) {
            dto.setUserId(crop.getUser().getId());
        }

        return dto;
    }
}
