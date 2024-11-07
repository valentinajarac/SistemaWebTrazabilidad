package com.trazafrutas.service;

import com.trazafrutas.exception.EntityNotFoundException;
import com.trazafrutas.model.Farm;
import com.trazafrutas.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {
    private final FarmRepository farmRepository;

    public List<Farm> getFarmsByUserId(Long userId) {
        return farmRepository.findByUserId(userId);
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada con ID: " + id));
    }

    @Transactional
    public Farm createFarm(Farm farm) {
        validateFarmData(farm);

        // Verificar si ya existe una finca con el mismo nombre para el usuario
        if (farmRepository.existsByNombreAndUserId(farm.getNombre(), farm.getUser().getId())) {
            throw new IllegalArgumentException("Ya existe una finca con este nombre para el usuario");
        }

        return farmRepository.save(farm);
    }

    @Transactional
    public Farm updateFarm(Long id, Farm updatedFarm) {
        Farm existingFarm = getFarmById(id);

        // Actualizar solo los campos que no son nulos
        if (updatedFarm.getNombre() != null) {
            // Verificar si el nuevo nombre ya existe para otro registro del mismo usuario
            if (!existingFarm.getNombre().equals(updatedFarm.getNombre()) &&
                    farmRepository.existsByNombreAndUserId(updatedFarm.getNombre(), existingFarm.getUser().getId())) {
                throw new IllegalArgumentException("Ya existe una finca con este nombre para el usuario");
            }
            existingFarm.setNombre(updatedFarm.getNombre());
        }
        if (updatedFarm.getHectareas() != null) {
            if (updatedFarm.getHectareas() <= 0) {
                throw new IllegalArgumentException("El número de hectáreas debe ser mayor a 0");
            }
            existingFarm.setHectareas(updatedFarm.getHectareas());
        }
        if (updatedFarm.getMunicipio() != null) {
            if (updatedFarm.getMunicipio().trim().isEmpty()) {
                throw new IllegalArgumentException("El municipio no puede estar vacío");
            }
            existingFarm.setMunicipio(updatedFarm.getMunicipio());
        }

        return farmRepository.save(existingFarm);
    }

    @Transactional
    public void deleteFarm(Long id) {
        if (!farmRepository.existsById(id)) {
            throw new EntityNotFoundException("Finca no encontrada con ID: " + id);
        }
        farmRepository.deleteById(id);
    }

    private void validateFarmData(Farm farm) {
        StringBuilder errors = new StringBuilder();

        if (farm.getNombre() == null || farm.getNombre().trim().isEmpty()) {
            errors.append("El nombre de la finca es requerido. ");
        }
        if (farm.getHectareas() == null) {
            errors.append("El número de hectáreas es requerido. ");
        } else if (farm.getHectareas() <= 0) {
            errors.append("El número de hectáreas debe ser mayor a 0. ");
        }
        if (farm.getMunicipio() == null || farm.getMunicipio().trim().isEmpty()) {
            errors.append("El municipio es requerido. ");
        }
        if (farm.getUser() == null) {
            errors.append("El usuario es requerido. ");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString().trim());
        }
    }
}