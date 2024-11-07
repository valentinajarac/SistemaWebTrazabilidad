package com.trazafrutas.repository;

import com.trazafrutas.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByUserId(Long userId);
    List<Crop> findByFarmId(Long farmId);

    @Query("SELECT COALESCE(SUM(c.hectareas), 0) FROM Crop c WHERE c.farm.id = :farmId")
    double sumHectareasByFarmId(@Param("farmId") Long farmId);
}