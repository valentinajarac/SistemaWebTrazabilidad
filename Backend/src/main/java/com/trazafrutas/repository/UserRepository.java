package com.trazafrutas.repository;

import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);
    boolean existsByCedula(String cedula);
    boolean existsByCodigoTrazabilidad(String codigoTrazabilidad);
    long countByRole(Role role);
}