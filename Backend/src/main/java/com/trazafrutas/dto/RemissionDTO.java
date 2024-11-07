package com.trazafrutas.dto;

import com.trazafrutas.model.enums.ProductType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RemissionDTO {
    private Long id;
    private LocalDate fechaDespacho;
    private Integer canastillasEnviadas;
    private Double kilosPromedio;
    private Double totalKilos;
    private ProductType producto;
    private Long userId;
    private Long farmId;
    private Long cropId;
    private Long clientId;
}