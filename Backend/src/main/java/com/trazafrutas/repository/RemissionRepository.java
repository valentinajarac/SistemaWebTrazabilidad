package com.trazafrutas.repository;

import com.trazafrutas.model.Remission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RemissionRepository extends JpaRepository<Remission, Long> {
    List<Remission> findByUserId(Long userId);

    @Query("SELECT FUNCTION('date_trunc', 'month', r.fechaDespacho) as mes, " +
            "SUM(CASE WHEN r.producto = 'UCHUVA' THEN r.totalKilos ELSE 0 END) as kilosUchuva, " +
            "SUM(CASE WHEN r.producto = 'GULUPA' THEN r.totalKilos ELSE 0 END) as kilosGulupa " +
            "FROM Remission r " +
            "WHERE r.user.id = :userId " +
            "GROUP BY FUNCTION('date_trunc', 'month', r.fechaDespacho) " +
            "ORDER BY mes")
    List<Object[]> getMonthlySummaryByUserId(@Param("userId") Long userId);
}