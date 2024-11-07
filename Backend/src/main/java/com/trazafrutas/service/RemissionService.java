package com.trazafrutas.service;

import com.trazafrutas.exception.EntityNotFoundException;
import com.trazafrutas.model.*;
import com.trazafrutas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RemissionService {
    private final RemissionRepository remissionRepository;
    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final ClientRepository clientRepository;

    public List<Remission> getRemissionsByUserId(Long userId) {
        return remissionRepository.findByUserId(userId);
    }

    public Remission getRemissionById(Long id) {
        return remissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Remisión no encontrada"));
    }

    @Transactional
    public Remission createRemission(Remission remission) {
        validateRemissionData(remission);

        // Verificar que la finca existe y pertenece al usuario
        Farm farm = farmRepository.findById(remission.getFarm().getId())
                .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

        if (!farm.getUser().getId().equals(remission.getUser().getId())) {
            throw new IllegalArgumentException("La finca no pertenece al usuario");
        }

        // Verificar que el cultivo existe y pertenece a la finca
        Crop crop = cropRepository.findById(remission.getCrop().getId())
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado"));

        if (!crop.getFarm().getId().equals(farm.getId())) {
            throw new IllegalArgumentException("El cultivo no pertenece a la finca seleccionada");
        }

        // Verificar que el producto coincide con el del cultivo
        if (remission.getProducto() != crop.getProducto()) {
            throw new IllegalArgumentException("El producto de la remisión debe coincidir con el del cultivo");
        }

        // Verificar que el cliente existe
        if (!clientRepository.existsById(remission.getClient().getId())) {
            throw new EntityNotFoundException("Cliente no encontrado");
        }

        // Calcular total de kilos
        remission.setTotalKilos(remission.getCanastillasEnviadas() * remission.getKilosPromedio());

        return remissionRepository.save(remission);
    }

    @Transactional
    public Remission updateRemission(Long id, Remission updatedRemission) {
        Remission existingRemission = getRemissionById(id);

        // Validar y actualizar fecha de despacho
        if (updatedRemission.getFechaDespacho() != null) {
            existingRemission.setFechaDespacho(updatedRemission.getFechaDespacho());
        }

        // Validar y actualizar canastillas enviadas
        if (updatedRemission.getCanastillasEnviadas() != null) {
            if (updatedRemission.getCanastillasEnviadas() <= 0) {
                throw new IllegalArgumentException("El número de canastillas debe ser mayor a 0");
            }
            existingRemission.setCanastillasEnviadas(updatedRemission.getCanastillasEnviadas());
            // Recalcular total de kilos
            existingRemission.setTotalKilos(
                    existingRemission.getCanastillasEnviadas() * existingRemission.getKilosPromedio());
        }

        // Validar y actualizar kilos promedio
        if (updatedRemission.getKilosPromedio() != null) {
            if (updatedRemission.getKilosPromedio() <= 0) {
                throw new IllegalArgumentException("Los kilos promedio deben ser mayor a 0");
            }
            existingRemission.setKilosPromedio(updatedRemission.getKilosPromedio());
            // Recalcular total de kilos
            existingRemission.setTotalKilos(
                    existingRemission.getCanastillasEnviadas() * existingRemission.getKilosPromedio());
        }

        // Validar y actualizar producto
        if (updatedRemission.getProducto() != null) {
            // Verificar que coincide con el producto del cultivo
            if (updatedRemission.getProducto() != existingRemission.getCrop().getProducto()) {
                throw new IllegalArgumentException("El producto debe coincidir con el del cultivo");
            }
            existingRemission.setProducto(updatedRemission.getProducto());
        }

        // Validar y actualizar finca
        if (updatedRemission.getFarm() != null) {
            Farm farm = farmRepository.findById(updatedRemission.getFarm().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Finca no encontrada"));

            if (!farm.getUser().getId().equals(existingRemission.getUser().getId())) {
                throw new IllegalArgumentException("La finca no pertenece al usuario");
            }
            existingRemission.setFarm(farm);
        }

        // Validar y actualizar cultivo
        if (updatedRemission.getCrop() != null) {
            Crop crop = cropRepository.findById(updatedRemission.getCrop().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado"));

            if (!crop.getFarm().getId().equals(existingRemission.getFarm().getId())) {
                throw new IllegalArgumentException("El cultivo no pertenece a la finca seleccionada");
            }

            if (existingRemission.getProducto() != crop.getProducto()) {
                throw new IllegalArgumentException("El producto debe coincidir con el del cultivo");
            }

            existingRemission.setCrop(crop);
        }

        // Validar y actualizar cliente
        if (updatedRemission.getClient() != null) {
            if (!clientRepository.existsById(updatedRemission.getClient().getId())) {
                throw new EntityNotFoundException("Cliente no encontrado");
            }
            existingRemission.setClient(updatedRemission.getClient());
        }

        return remissionRepository.save(existingRemission);
    }

    @Transactional
    public void deleteRemission(Long id) {
        if (!remissionRepository.existsById(id)) {
            throw new EntityNotFoundException("Remisión no encontrada");
        }
        remissionRepository.deleteById(id);
    }

    public List<Object[]> getMonthlySummary(Long userId) {
        return remissionRepository.getMonthlySummaryByUserId(userId);
    }

    private void validateRemissionData(Remission remission) {
        StringBuilder errors = new StringBuilder();

        if (remission.getFechaDespacho() == null) {
            errors.append("La fecha de despacho es requerida. ");
        }

        if (remission.getCanastillasEnviadas() == null) {
            errors.append("El número de canastillas es requerido. ");
        } else if (remission.getCanastillasEnviadas() <= 0) {
            errors.append("El número de canastillas debe ser mayor a 0. ");
        }

        if (remission.getKilosPromedio() == null) {
            errors.append("Los kilos promedio son requeridos. ");
        } else if (remission.getKilosPromedio() <= 0) {
            errors.append("Los kilos promedio deben ser mayor a 0. ");
        }

        if (remission.getProducto() == null) {
            errors.append("El producto es requerido. ");
        }

        if (remission.getFarm() == null || remission.getFarm().getId() == null) {
            errors.append("La finca es requerida. ");
        }

        if (remission.getCrop() == null || remission.getCrop().getId() == null) {
            errors.append("El cultivo es requerido. ");
        }

        if (remission.getClient() == null || remission.getClient().getId() == null) {
            errors.append("El cliente es requerido. ");
        }

        if (remission.getUser() == null) {
            errors.append("El usuario es requerido. ");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString().trim());
        }
    }
}