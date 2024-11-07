package com.trazafrutas.dto;

import com.trazafrutas.model.enums.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String cedula;
    private String nombreCompleto;
    private String codigoTrazabilidad;
    private String municipio;
    private String telefono;
    private String usuario;
    private Role role;
}