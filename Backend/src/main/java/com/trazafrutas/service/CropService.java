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

    /**
     * Obtiene todos los cultivos.
     *
     * @return Lista de todos los cultivos.
     */
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    /**
     * Obtiene los cultivos de un usuario específico.
     *
     * @param userId ID del usuario.
     * @return Lista de cultivos del usuario.
     */
    public List<Crop> getCropsByUserId(Long userId) {
        return cropRepository.findByUserIdWithFarm(userId);
    }

    /**
     * Obtiene los cultivos de una finca específica para un usuario.
     *
     * @param farmId ID de la finca.
     * @param userId ID del usuario.
     * @return Lista de cultivos de la finca.
     * @throws EntityNotFoundException si la finca no existe o no pertenece al usuario.
     */
    public List<Crop> getCropsByFarmId(Long farmId, Long userId) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

        if (!farm.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("La finca no pertenece al usuario");
        }

        return cropRepository.findByFarmIdWithFarm(farmId);
    }

    /**
     * Obtiene un cultivo por su ID.
     *
     * @param id ID del cultivo.
     * @return El cultivo encontrado.
     * @throws EntityNotFoundException si el cultivo no existe.
     */
    public Crop getCropById(Long id) {
        return cropRepository.findByIdWithFarm(id)
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado"));
    }

    /**
     * Crea un nuevo cultivo.
     *
     * @param crop El cultivo a crear.
     * @return El cultivo creado.
     * @throws IllegalArgumentException si los datos del cultivo no son válidos.
     */
    @Transactional
    public Crop createCrop(Crop crop) {
        validateCropData(crop);

        Farm farm = farmRepository.findById(crop.getFarm().getId())
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

        if (!farm.getUser().getId().equals(crop.getUser().getId())) {
            throw new IllegalArgumentException("La finca no pertenece al usuario");
        }

        double hectareasUsadas = cropRepository.sumHectareasByFarmId(farm.getId());
        double hectareasDisponibles = farm.getHectareas() - hectareasUsadas;

        if (crop.getHectareas() > hectareasDisponibles) {
            throw new IllegalArgumentException(
                    String.format("La finca solo tiene %.2f hectáreas disponibles de %.2f hectáreas totales",
                            hectareasDisponibles, farm.getHectareas()));
        }

        crop.setFarm(farm);
        return cropRepository.save(crop);
    }

    /**
     * Actualiza un cultivo existente.
     *
     * @param id ID del cultivo a actualizar.
     * @param updatedCrop Datos actualizados del cultivo.
     * @return El cultivo actualizado.
     * @throws IllegalArgumentException si los datos del cultivo no son válidos.
     */
    @Transactional
    public Crop updateCrop(Long id, Crop updatedCrop) {
        Crop existingCrop = getCropById(id);

        if (updatedCrop.getNumeroPlants() != null) {
            if (updatedCrop.getNumeroPlants() <= 0) {
                throw new IllegalArgumentException("El número de plantas debe ser mayor a 0");
            }
            existingCrop.setNumeroPlants(updatedCrop.getNumeroPlants());
        }

        if (updatedCrop.getHectareas() != null) {
            if (updatedCrop.getHectareas() <= 0) {
                throw new IllegalArgumentException("Las hectáreas deben ser mayor a 0");
            }

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
                        String.format("La finca solo tiene %.2f hectáreas disponibles de %.2f hectáreas totales",
                                hectareasDisponibles, farm.getHectareas()));
            }

            existingCrop.setHectareas(updatedCrop.getHectareas());
        }

        if (updatedCrop.getProducto() != null) {
            existingCrop.setProducto(updatedCrop.getProducto());
        }

        if (updatedCrop.getEstado() != null) {
            existingCrop.setEstado(updatedCrop.getEstado());
        }

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

    /**
     * Elimina un cultivo por su ID.
     *
     * @param id ID del cultivo a eliminar.
     * @throws EntityNotFoundException si el cultivo no existe.
     */
    @Transactional
    public void deleteCrop(Long id) {
        if (!cropRepository.existsById(id)) {
            throw new EntityNotFoundException("Cultivo no encontrado");
        }
        cropRepository.deleteById(id);
    }

    /**
     * Valida los datos de un cultivo.
     *
     * @param crop El cultivo a validar.
     * @throws IllegalArgumentException si los datos no son válidos.
     */
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
