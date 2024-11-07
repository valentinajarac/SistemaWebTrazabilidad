package com.trazafrutas.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStats {
    private LocalDate mes;
    private Double kilosUchuva;
    private Double kilosGulupa;

    public Double getKilosUchuva() {
        return kilosUchuva != null ? kilosUchuva : 0.0;
    }

    public Double getKilosGulupa() {
        return kilosGulupa != null ? kilosGulupa : 0.0;
    }
}