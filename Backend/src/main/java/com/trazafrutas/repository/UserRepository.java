package com.trazafrutas.repository;

import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.model.enums.UserStatus;
import com.trazafrutas.model.enums.Certification;
import com.trazafrutas.dto.DashboardStats.ProduccionPorMunicipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsuario(String usuario);
    Optional<User> findByCedula(String cedula);
    Optional<User> findByCodigoTrazabilidad(String codigoTrazabilidad);

    boolean existsByUsuario(String usuario);
    boolean existsByCedula(String cedula);
    boolean existsByCodigoTrazabilidad(String codigoTrazabilidad);

    List<User> findByStatus(UserStatus status);
    List<User> findByCertificationsContaining(Certification certification);

    long countByRole(Role role);
    long countByRoleAndStatus(Role role, UserStatus status);

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.certifications c " +
            "WHERE u.role = :role AND c = :certification AND u.status = 'ACTIVO'")
    long countByRoleAndCertification(@Param("role") Role role,
                                     @Param("certification") Certification certification);

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.certifications c " +
            "WHERE u.role = :role AND c IN :certifications AND u.status = 'ACTIVO'")
    long countDistinctByRoleAndCertificationsIn(@Param("role") Role role,
                                                @Param("certifications") Collection<Certification> certifications);

    @Query("SELECT new com.trazafrutas.dto.DashboardStats$ProduccionPorMunicipio(u.municipio, COUNT(u)) " +
            "FROM User u " +
            "WHERE u.role = 'PRODUCER' AND u.status = 'ACTIVO' " +
            "GROUP BY u.municipio " +
            "ORDER BY COUNT(u) DESC")
    List<ProduccionPorMunicipio> countProductoresPorMunicipio();
}