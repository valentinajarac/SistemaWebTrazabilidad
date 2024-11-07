package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.model.Crop;
import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.service.CropService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {
    private final CropService cropService;

    private ResponseEntity<?> checkProducerRole(User user) {
        if (user.getRole() != Role.PRODUCER) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Solo los productores pueden gestionar cultivos"));
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyCrops(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<Crop> crops = cropService.getCropsByUserId(user.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Cultivos obtenidos exitosamente", crops));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener los cultivos: " + e.getMessage()));
        }
    }

    @GetMapping("/farm/{farmId}")
    public ResponseEntity<?> getCropsByFarmId(
            @PathVariable Long farmId,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<Crop> crops = cropService.getCropsByFarmId(farmId, user.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Cultivos obtenidos exitosamente", crops));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener los cultivos: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCropById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Crop crop = cropService.getCropById(id);
            if (!crop.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para ver este cultivo"));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Cultivo encontrado", crop));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@RequestBody Crop crop, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            crop.setUser(user);
            Crop newCrop = cropService.createCrop(crop);
            return ResponseEntity.ok(new ApiResponse(true, "Cultivo creado exitosamente", newCrop));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al crear el cultivo: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(
            @PathVariable Long id,
            @RequestBody Crop crop,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Crop existingCrop = cropService.getCropById(id);
            if (!existingCrop.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para modificar este cultivo"));
            }

            Crop updatedCrop = cropService.updateCrop(id, crop);
            return ResponseEntity.ok(new ApiResponse(true, "Cultivo actualizado exitosamente", updatedCrop));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al actualizar el cultivo: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Crop crop = cropService.getCropById(id);
            if (!crop.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para eliminar este cultivo"));
            }

            cropService.deleteCrop(id);
            return ResponseEntity.ok(new ApiResponse(true, "Cultivo eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}