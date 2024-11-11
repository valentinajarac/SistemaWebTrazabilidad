package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/public/password")
@RequiredArgsConstructor
public class PasswordTestController {
    private static final Logger logger = LoggerFactory.getLogger(PasswordTestController.class);

    private final PasswordEncoder passwordEncoder;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPassword(@RequestBody PasswordTestRequest request) {
        try {
            String rawPassword = request.password();
            String storedHash = request.storedHash();

            // Generar un nuevo hash para la contraseña proporcionada
            String newHash = passwordEncoder.encode(rawPassword);

            // Verificar si la contraseña coincide con el hash almacenado
            boolean matches = passwordEncoder.matches(rawPassword, storedHash);

            logger.debug("Contraseña proporcionada: {}", rawPassword);
            logger.debug("Hash almacenado: {}", storedHash);
            logger.debug("Nuevo hash generado: {}", newHash);
            logger.debug("¿Coinciden?: {}", matches);

            return ResponseEntity.ok(new ApiResponse(true, "Verificación de contraseña", new PasswordTestResponse(
                    newHash,
                    matches
            )));
        } catch (Exception e) {
            logger.error("Error al verificar contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error al verificar contraseña: " + e.getMessage()));
        }
    }

    private record PasswordTestRequest(String password, String storedHash) {}
    private record PasswordTestResponse(String generatedHash, boolean matches) {}
}