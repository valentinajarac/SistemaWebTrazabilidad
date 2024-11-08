package com.trazafrutas.repository;

import com.trazafrutas.model.Remission;
import com.trazafrutas.dto.MonthlyStats;
import com.trazafrutas.dto.CurrentMonthStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RemissionRepository extends JpaRepository<Remission, Long> {
    List<Remission> findByUserId(Long userId);

    @Query("""
        SELECT new com.trazafrutas.dto.MonthlyStats(
            r.fechaDespacho,
            SUM(CASE WHEN r.producto = 'UCHUVA' THEN r.totalKilos ELSE 0 END),
            SUM(CASE WHEN r.producto = 'GULUPA' THEN r.totalKilos ELSE 0 END)
        )
        FROM Remission r
        WHERE r.fechaDespacho >= first_day_of_month(subtract_months(CURRENT_TIMESTAMP, 11))
        GROUP BY year(r.fechaDespacho), month(r.fechaDespacho), r.fechaDespacho
        ORDER BY r.fechaDespacho DESC
    """)
    List<MonthlyStats> getMonthlySummary();

    @Query("""
        SELECT new com.trazafrutas.dto.MonthlyStats(
            r.fechaDespacho,
            SUM(CASE WHEN r.producto = 'UCHUVA' THEN r.totalKilos ELSE 0 END),
            SUM(CASE WHEN r.producto = 'GULUPA' THEN r.totalKilos ELSE 0 END)
        )
        FROM Remission r
        WHERE r.user.id = :userId
        AND r.fechaDespacho >= first_day_of_month(subtract_months(CURRENT_TIMESTAMP, 11))
        GROUP BY year(r.fechaDespacho), month(r.fechaDespacho), r.fechaDespacho
        ORDER BY r.fechaDespacho DESC
    """)
    List<MonthlyStats> getMonthlySummaryByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT new com.trazafrutas.dto.CurrentMonthStats(
            COUNT(r),
            SUM(CASE WHEN r.producto = 'UCHUVA' THEN r.totalKilos ELSE 0 END),
            SUM(CASE WHEN r.producto = 'GULUPA' THEN r.totalKilos ELSE 0 END)
        )
        FROM Remission r
        WHERE r.fechaDespacho BETWEEN first_day_of_month(CURRENT_TIMESTAMP) AND last_day_of_month(CURRENT_TIMESTAMP)
    """)
    CurrentMonthStats getCurrentMonthStats();

    @Query("""
        SELECT new com.trazafrutas.dto.CurrentMonthStats(
            COUNT(r),
            SUM(CASE WHEN r.producto = 'UCHUVA' THEN r.totalKilos ELSE 0 END),
            SUM(CASE WHEN r.producto = 'GULUPA' THEN r.totalKilos ELSE 0 END)
        )
        FROM Remission r
        WHERE r.user.id = :userId
        AND r.fechaDespacho BETWEEN first_day_of_month(CURRENT_TIMESTAMP) AND last_day_of_month(CURRENT_TIMESTAMP)
    """)
    CurrentMonthStats getCurrentMonthStatsByUserId(@Param("userId") Long userId);
}

