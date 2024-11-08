package com.trazafrutas.repository;

import com.trazafrutas.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CropRepository extends JpaRepository<Crop, Long> {
    @Query("SELECT c FROM Crop c JOIN FETCH c.farm WHERE c.user.id = :userId")
    List<Crop> findByUserIdWithFarm(@Param("userId") Long userId);

    @Query("SELECT c FROM Crop c JOIN FETCH c.farm WHERE c.farm.id = :farmId")
    List<Crop> findByFarmIdWithFarm(@Param("farmId") Long farmId);

    @Query("SELECT c FROM Crop c JOIN FETCH c.farm WHERE c.id = :id")
    Optional<Crop> findByIdWithFarm(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(c.hectareas), 0) FROM Crop c WHERE c.farm.id = :farmId")
    double sumHectareasByFarmId(@Param("farmId") Long farmId);

    long countByUserId(Long userId);
}
