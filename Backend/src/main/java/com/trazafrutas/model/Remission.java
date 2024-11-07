package com.trazafrutas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.trazafrutas.model.enums.ProductType;

@Data
@Entity
@Table(name = "remissions")
public class Remission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaDespacho;
    private Integer canastillasEnviadas;
    private Double kilosPromedio;
    private Double totalKilos;

    @Enumerated(EnumType.STRING)
    private ProductType producto;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @ManyToOne
    @JoinColumn(name = "crop_id")
    private Crop crop;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}