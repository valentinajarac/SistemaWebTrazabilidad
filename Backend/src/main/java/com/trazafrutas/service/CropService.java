package com.trazafrutas.service;

import com.trazafrutas.exception.EntityNotFoundException;
import com.trazafrutas.model.Crop;
import com.trazafrutas.model.Farm;
import com.trazafrutas.repository.CropRepository;
import com.trazafrutas.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropService {
    private final CropRepository cropRepository;
    private final FarmRepository farmRepository;

    public List<Crop> getCropsByUserId(Long userId) {
        return cropRepository.findByUserId(userId);
    }

    public List<Crop> getCropsByFarmId(Long farmId, Long userId) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

        if (!farm.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("La finca no pertenece al usuario");
        }

        return cropRepository.findByFarmId(farmId);
    }

    public Crop getCropById(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado"));
    }

    @Transactional
    public Crop createCrop(Crop crop) {
        validateCropData(crop);

        // Verificar que la finca existe y pertenece al usuario
        Farm farm = farmRepository.findById(crop.getFarm().getId())
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

        if (!farm.getUser().getId().equals(crop.getUser().getId())) {
            throw new IllegalArgumentException("La finca no pertenece al usuario");
        }

        // Calcular hectáreas disponibles
        double hectareasUsadas = cropRepository.sumHectareasByFarmId(farm.getId());
        double hectareasDisponibles = farm.getHectareas() - hectareasUsadas;

        if (crop.getHectareas() > hectareasDisponibles) {
            throw new IllegalArgumentException(
                    String.format("La finca solo tiene %.2f hectáreas disponibles", hectareasDisponibles));
        }

        return cropRepository.save(crop);
    }

    @Transactional
    public Crop updateCrop(Long id, Crop updatedCrop) {
        Crop existingCrop = getCropById(id);

        // Validar y actualizar número de plantas
        if (updatedCrop.getNumeroPlants() != null) {
            if (updatedCrop.getNumeroPlants() <= 0) {
                throw new IllegalArgumentException("El número de plantas debe ser mayor a 0");
            }
            existingCrop.setNumeroPlants(updatedCrop.getNumeroPlants());
        }

        // Validar y actualizar hectáreas
        if (updatedCrop.getHectareas() != null) {
            if (updatedCrop.getHectareas() <= 0) {
                throw new IllegalArgumentException("Las hectáreas deben ser mayor a 0");
            }

            // Si cambia la finca, verificar hectáreas disponibles en la nueva finca
            Farm farm = existingCrop.getFarm();
            if (updatedCrop.getFarm() != null && !updatedCrop.getFarm().getId().equals(farm.getId())) {
                farm = farmRepository.findById(updatedCrop.getFarm().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

                if (!farm.getUser().getId().equals(existingCrop.getUser().getId())) {
                    throw new IllegalArgumentException("La finca no pertenece al usuario");
                }
            }

            double hectareasUsadas = cropRepository.sumHectareasByFarmId(farm.getId());
            double hectareasActuales = existingCrop.getHectareas();
            double hectareasDisponibles = farm.getHectareas() - (hectareasUsadas - hectareasActuales);

            if (updatedCrop.getHectareas() > hectareasDisponibles) {
                throw new IllegalArgumentException(
                        String.format("La finca solo tiene %.2f hectáreas disponibles", hectareasDisponibles));
            }

            existingCrop.setHectareas(updatedCrop.getHectareas());
        }

        // Validar y actualizar producto
        if (updatedCrop.getProducto() != null) {
            existingCrop.setProducto(updatedCrop.getProducto());
        }

        // Validar y actualizar estado
        if (updatedCrop.getEstado() != null) {
            existingCrop.setEstado(updatedCrop.getEstado());
        }

        // Validar y actualizar finca
        if (updatedCrop.getFarm() != null) {
            Farm farm = farmRepository.findById(updatedCrop.getFarm().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

            if (!farm.getUser().getId().equals(existingCrop.getUser().getId())) {
                throw new IllegalArgumentException("La finca no pertenece al usuario");
            }
            existingCrop.setFarm(farm);
        }

        return cropRepository.save(existingCrop);
    }

    @Transactional
    public void deleteCrop(Long id) {
        if (!cropRepository.existsById(id)) {
            throw new EntityNotFoundException("Cultivo no encontrado");
        }
        cropRepository.deleteById(id);
    }

    private void validateCropData(Crop crop) {
        StringBuilder errors = new StringBuilder();

        if (crop.getNumeroPlants() == null) {
            errors.append("El número de plantas es requerido. ");
        } else if (crop.getNumeroPlants() <= 0) {
            errors.append("El número de plantas debe ser mayor a 0. ");
        }

        if (crop.getHectareas() == null) {
            errors.append("Las hectáreas son requeridas. ");
        } else if (crop.getHectareas() <= 0) {
            errors.append("Las hectáreas deben ser mayor a 0. ");
        }

        if (crop.getProducto() == null) {
            errors.append("El producto es requerido. ");
        }

        if (crop.getEstado() == null) {
            errors.append("El estado es requerido. ");
        }

        if (crop.getFarm() == null || crop.getFarm().getId() == null) {
            errors.append("La finca es requerida. ");
        }

        if (crop.getUser() == null) {
            errors.append("El usuario es requerido. ");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString().trim());
        }
    }
}