package com.trazafrutas.dto.admin;

import com.trazafrutas.model.Farm;
import lombok.Data;

@Data
public class AdminFarmDTO {
    private Long id;
    private String nombre;
    private Double hectareas;
    private String municipio;
    private String productor;

    public static AdminFarmDTO fromEntity(Farm farm) {
        AdminFarmDTO dto = new AdminFarmDTO();
        dto.setId(farm.getId());
        dto.setNombre(farm.getNombre());
        dto.setHectareas(farm.getHectareas());
        dto.setMunicipio(farm.getMunicipio());
        dto.setProductor(farm.getUser() != null ? farm.getUser().getNombreCompleto() : "N/A");
        return dto;
    }
}
