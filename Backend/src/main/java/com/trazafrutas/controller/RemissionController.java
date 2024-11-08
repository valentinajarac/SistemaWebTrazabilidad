package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.dto.RemissionDTO;
import com.trazafrutas.model.Remission;
import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.service.RemissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/remissions")
@RequiredArgsConstructor
public class RemissionController {
    private final RemissionService remissionService;

    private ResponseEntity<?> checkProducerRole(User user) {
        if (user.getRole() != Role.PRODUCER) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Solo los productores pueden gestionar remisiones"));
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyRemissions(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<Remission> remissions = remissionService.getRemissionsByUserId(user.getId());
            List<RemissionDTO> remissionDTOs = remissions.stream()
                    .map(RemissionDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Remisiones obtenidas exitosamente", remissionDTOs));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener las remisiones: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRemissionById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Remission remission = remissionService.getRemissionById(id);
            if (!remission.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para ver esta remisión"));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Remisión encontrada", RemissionDTO.fromEntity(remission)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRemission(@RequestBody Remission remission, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            remission.setUser(user);
            Remission newRemission = remissionService.createRemission(remission);
            return ResponseEntity.ok(new ApiResponse(true, "Remisión creada exitosamente", RemissionDTO.fromEntity(newRemission)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al crear la remisión: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRemission(
            @PathVariable Long id,
            @RequestBody Remission remission,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Remission existingRemission = remissionService.getRemissionById(id);
            if (!existingRemission.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para modificar esta remisión"));
            }

            remission.setUser(user);
            Remission updatedRemission = remissionService.updateRemission(id, remission);
            return ResponseEntity.ok(new ApiResponse(true, "Remisión actualizada exitosamente", RemissionDTO.fromEntity(updatedRemission)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al actualizar la remisión: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRemission(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Remission remission = remissionService.getRemissionById(id);
            if (!remission.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse(false, "No tiene permiso para eliminar esta remisión"));
            }

            remissionService.deleteRemission(id);
            return ResponseEntity.ok(new ApiResponse(true, "Remisión eliminada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<?> getMonthlySummary(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkProducerRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            var monthlyStats = remissionService.getMonthlySummary(user.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Resumen mensual obtenido exitosamente", monthlyStats));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener el resumen mensual: " + e.getMessage()));
        }
    }
}