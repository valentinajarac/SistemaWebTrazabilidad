package com.trazafrutas.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "farms")
public class Farm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private Double hectareas;
    private String municipio;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}