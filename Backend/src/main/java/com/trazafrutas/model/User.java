package com.trazafrutas.model;

import jakarta.persistence.*;
import lombok.Data;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.model.enums.UserStatus;
import com.trazafrutas.model.enums.Certification;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cedula", unique = true, nullable = false)
    private String cedula;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "codigo_trazabilidad", unique = true, nullable = false)
    private String codigoTrazabilidad;

    @Column(name = "municipio", nullable = false)
    private String municipio;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "usuario", unique = true, nullable = false)
    private String usuario;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status = UserStatus.ACTIVO;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_certifications",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "certification")
    @Enumerated(EnumType.STRING)
    private Set<Certification> certifications = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return usuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status == UserStatus.ACTIVO;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVO;
    }
}