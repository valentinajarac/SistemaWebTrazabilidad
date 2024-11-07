package com.trazafrutas.dto;

import lombok.Data;

@Data
public class FarmDTO {
    private Long id;
    private String nombre;
    private Double hectareas;
    private String municipio;
    private Long userId;
}