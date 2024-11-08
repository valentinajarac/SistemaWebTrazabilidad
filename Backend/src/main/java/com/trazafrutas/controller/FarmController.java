package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.dto.FarmDTO;
import com.trazafrutas.model.Farm;
import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {
    private final FarmService farmService;

    private ResponseEntity<?> checkProducerRole(User user) {
        if (user.getRole() != Role.PRODUCER) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Solo los productores pueden gestionar fincas"));
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyFarms(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<Farm> farms = farmService.getFarmsByUserId(user.getId());
            List<FarmDTO> farmDTOs = farms.stream()
                    .map(FarmDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Fincas obtenidas exitosamente", farmDTOs));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener las fincas: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFarmById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Farm farm = farmService.getFarmById(id);
            // Verificar que la finca pertenece al usuario autenticado
            if (!farm.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para ver esta finca"));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Finca encontrada", FarmDTO.fromEntity(farm)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createFarm(@RequestBody Farm farm, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            farm.setUser(user);
            Farm createdFarm = farmService.createFarm(farm);
            return ResponseEntity.ok(new ApiResponse(true, "Finca creada exitosamente", FarmDTO.fromEntity(createdFarm)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al crear la finca: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFarm(
            @PathVariable Long id,
            @RequestBody Farm farm,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            // Verificar que la finca existe y pertenece al usuario
            Farm existingFarm = farmService.getFarmById(id);
            if (!existingFarm.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para modificar esta finca"));
            }

            farm.setUser(user);
            Farm updatedFarm = farmService.updateFarm(id, farm);
            return ResponseEntity.ok(new ApiResponse(true, "Finca actualizada exitosamente", FarmDTO.fromEntity(updatedFarm)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al actualizar la finca: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFarm(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            // Verificar que la finca existe y pertenece al usuario
            Farm farm = farmService.getFarmById(id);
            if (!farm.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para eliminar esta finca"));
            }

            farmService.deleteFarm(id);
            return ResponseEntity.ok()
                    .body(new ApiResponse(true, "Finca eliminada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}