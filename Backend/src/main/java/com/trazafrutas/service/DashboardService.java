package com.trazafrutas.service;

import com.trazafrutas.dto.MonthlyStats;
import com.trazafrutas.dto.CurrentMonthStats;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final RemissionRepository remissionRepository;

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        // Contar productores (usuarios con rol PRODUCER)
        long totalProductores = userRepository.countByRole(Role.PRODUCER);
        stats.put("totalProductores", totalProductores);

        // Contar fincas
        long totalFincas = farmRepository.count();
        stats.put("totalFincas", totalFincas);

        // Contar cultivos
        long totalCultivos = cropRepository.count();
        stats.put("totalCultivos", totalCultivos);

        // Obtener estadísticas del mes actual
        CurrentMonthStats monthlyStats = remissionRepository.getCurrentMonthStats();
        if (monthlyStats != null) {
            stats.put("despachosMes", monthlyStats.getDespachos());
            stats.put("kilosUchuvaMes", monthlyStats.getKilosUchuva());
            stats.put("kilosGulupaMes", monthlyStats.getKilosGulupa());
        } else {
            stats.put("despachosMes", 0L);
            stats.put("kilosUchuvaMes", 0.0);
            stats.put("kilosGulupaMes", 0.0);
        }

        return stats;
    }

    public List<MonthlyStats> getMonthlyStats() {
        return remissionRepository.getMonthlySummary();
    }
}