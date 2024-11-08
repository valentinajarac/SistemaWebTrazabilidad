package com.trazafrutas.dto;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalProductores;
    private long productoresUchuva;
    private long productoresGulupa;
    private long totalFincas;
    private long totalCultivos;
    private long cultivosUchuva;
    private long cultivosGulupa;
    private long despachosMes;
    private double kilosUchuvaMes;
    private double kilosGulupaMes;
}