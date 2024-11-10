package com.trazafrutas.service;

import com.trazafrutas.dto.DashboardStats;
import com.trazafrutas.dto.MonthlyStats;
import com.trazafrutas.dto.CurrentMonthStats;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.model.enums.UserStatus;
import com.trazafrutas.model.enums.ProductType;
import com.trazafrutas.model.enums.CropStatus;
import com.trazafrutas.model.enums.Certification;
import com.trazafrutas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
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
        stats.setProductoresActivos(userRepository.countByRoleAndStatus(Role.PRODUCER, UserStatus.ACTIVO));
        stats.setProductoresInactivos(userRepository.countByRoleAndStatus(Role.PRODUCER, UserStatus.INACTIVO));
        stats.setTotalProductores(stats.getProductoresActivos() + stats.getProductoresInactivos());

        // Estadísticas de productores por producto
        stats.setProductoresUchuva(cropRepository.countProducersByProducto(ProductType.UCHUVA));
        stats.setProductoresGulupa(cropRepository.countProducersByProducto(ProductType.GULUPA));

        // Estadísticas de certificaciones (solo productores activos)
        stats.setProductoresFairtrade(userRepository.countByRoleAndCertification(Role.PRODUCER, Certification.FAIRTRADE_USA));
        stats.setProductoresGlobalGap(userRepository.countByRoleAndCertification(Role.PRODUCER, Certification.GLOBAL_GAP));
        stats.setProductoresIca(userRepository.countByRoleAndCertification(Role.PRODUCER, Certification.ICA));
        stats.setProductoresSinCertificacion(userRepository.countByRoleAndCertification(Role.PRODUCER, Certification.NINGUNA));

        // Productores activos con al menos una certificación
        stats.setProductoresConCertificacion(
                userRepository.countDistinctByRoleAndCertificationsIn(
                        Role.PRODUCER,
                        Arrays.asList(Certification.FAIRTRADE_USA, Certification.GLOBAL_GAP, Certification.ICA)
                )
        );

        // Estadísticas de fincas y cultivos
        stats.setTotalFincas(farmRepository.count());
        stats.setTotalCultivos(cropRepository.count());
        stats.setCultivosProduccion(cropRepository.countByEstado(CropStatus.PRODUCCION));
        stats.setCultivosVegetacion(cropRepository.countByEstado(CropStatus.VEGETACION));
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

        // Distribución de productores por municipio
        stats.setProduccionesPorMunicipio(userRepository.countProductoresPorMunicipio());

        return stats;
    }

    public List<MonthlyStats> getMonthlyStats() {
        return remissionRepository.getMonthlySummary();
    }
}