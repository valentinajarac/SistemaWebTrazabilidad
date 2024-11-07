package com.trazafrutas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.trazafrutas.model.enums.ProductType;
import com.trazafrutas.model.enums.CropStatus;

@Data
@Entity
@Table(name = "crops")
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El número de plantas es requerido")
    @Min(value = 1, message = "El número de plantas debe ser mayor a 0")
    private Integer numeroPlants;

    @NotNull(message = "Las hectáreas son requeridas")
    @Min(value = 0, message = "Las hectáreas deben ser mayor o igual a 0")
    private Double hectareas;

    @NotNull(message = "El producto es requerido")
    @Enumerated(EnumType.STRING)
    private ProductType producto;

    @NotNull(message = "El estado es requerido")
    @Enumerated(EnumType.STRING)
    private CropStatus estado;

    @NotNull(message = "La finca es requerida")
    @ManyToOne(optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @NotNull(message = "El usuario es requerido")
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
