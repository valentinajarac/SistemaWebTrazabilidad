package com.trazafrutas.service;

import com.trazafrutas.dto.MonthlyStats;
import com.trazafrutas.dto.CurrentMonthStats;
import com.trazafrutas.dto.DashboardStats;
import com.trazafrutas.model.enums.ProductType;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final RemissionRepository remissionRepository;

    public DashboardStats getAdminStats() {
        DashboardStats stats = new DashboardStats();

        // Estadísticas de productores
        stats.setTotalProductores(userRepository.countByRole(Role.PRODUCER));
        stats.setProductoresUchuva(cropRepository.countProducersByProducto(ProductType.UCHUVA));
        stats.setProductoresGulupa(cropRepository.countProducersByProducto(ProductType.GULUPA));

        // Estadísticas de fincas
        stats.setTotalFincas(farmRepository.count());

        // Estadísticas de cultivos
        stats.setTotalCultivos(cropRepository.count());
        stats.setCultivosUchuva(cropRepository.countByProducto(ProductType.UCHUVA));
        stats.setCultivosGulupa(cropRepository.countByProducto(ProductType.GULUPA));

        // Estadísticas del mes actual
        CurrentMonthStats monthlyStats = remissionRepository.getCurrentMonthStats();
        if (monthlyStats != null) {
            stats.setDespachosMes(monthlyStats.getDespachos());
            stats.setKilosUchuvaMes(monthlyStats.getKilosUchuva());
            stats.setKilosGulupaMes(monthlyStats.getKilosGulupa());
        } else {
            stats.setDespachosMes(0L);
            stats.setKilosUchuvaMes(0.0);
            stats.setKilosGulupaMes(0.0);
        }

        return stats;
    }

    public List<MonthlyStats> getMonthlyStats() {
        return remissionRepository.getMonthlySummary();
    }
}