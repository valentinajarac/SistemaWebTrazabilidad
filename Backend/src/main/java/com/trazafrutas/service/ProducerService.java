package com.trazafrutas.service;

import com.trazafrutas.dto.MonthlyStats;
import com.trazafrutas.dto.CurrentMonthStats;
import com.trazafrutas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProducerService {
    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final RemissionRepository remissionRepository;

    public Map<String, Object> getProducerStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();

        // Contar fincas del productor
        long totalFincas = farmRepository.countByUserId(userId);
        stats.put("totalFincas", totalFincas);

        // Contar cultivos del productor
        long totalCultivos = cropRepository.countByUserId(userId);
        stats.put("totalCultivos", totalCultivos);

        // Obtener estadísticas del mes actual para el productor
        CurrentMonthStats monthlyStats = remissionRepository.getCurrentMonthStatsByUserId(userId);
        if (monthlyStats != null) {
            stats.put("totalRemisiones", monthlyStats.getDespachos());
            stats.put("kilosTotales", monthlyStats.getKilosUchuva() + monthlyStats.getKilosGulupa());
        } else {
            stats.put("totalRemisiones", 0L);
            stats.put("kilosTotales", 0.0);
        }

        return stats;
    }

    public List<MonthlyStats> getMonthlyStats(Long userId) {
        return remissionRepository.getMonthlySummaryByUserId(userId);
    }
}