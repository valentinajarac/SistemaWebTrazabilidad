package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.model.User;
import com.trazafrutas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/test")
@RequiredArgsConstructor
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/auth-config")
    public ResponseEntity<?> testAuthConfig() {
        try {
            // Generar un hash de prueba
            String testPassword = "admin123";
            String encodedPassword = passwordEncoder.encode(testPassword);

            // Buscar el usuario admin
            User adminUser = userRepository.findByUsuario("admin")
                    .orElse(null);

            Map<String, Object> testResults = new HashMap<>();
            testResults.put("testPassword", testPassword);
            testResults.put("generatedHash", encodedPassword);

            if (adminUser != null) {
                testResults.put("adminExists", true);
                testResults.put("storedHash", adminUser.getPassword());
                testResults.put("passwordMatches", passwordEncoder.matches(testPassword, adminUser.getPassword()));
                testResults.put("encoderMatches", passwordEncoder.matches(testPassword, encodedPassword));
            } else {
                testResults.put("adminExists", false);
            }

            logger.debug("Test de configuración de autenticación: {}", testResults);

            return ResponseEntity.ok(new ApiResponse(true, "Test de configuración de autenticación", testResults));
        } catch (Exception e) {
            logger.error("Error en test de configuración: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error en test de configuración: " + e.getMessage()));
        }
    }

    @PostMapping("/encode")
    public ResponseEntity<?> encodePassword(@RequestBody PasswordRequest request) {
        try {
            String encodedPassword = passwordEncoder.encode(request.password());

            Map<String, Object> response = new HashMap<>();
            response.put("originalPassword", request.password());
            response.put("encodedPassword", encodedPassword);

            logger.debug("Contraseña codificada exitosamente: {}", response);

            return ResponseEntity.ok(new ApiResponse(true, "Contraseña codificada", response));
        } catch (Exception e) {
            logger.error("Error al codificar contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error al codificar contraseña: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPassword(@RequestBody VerifyRequest request) {
        try {
            boolean matches = passwordEncoder.matches(request.rawPassword(), request.hashedPassword());

            Map<String, Object> response = new HashMap<>();
            response.put("rawPassword", request.rawPassword());
            response.put("hashedPassword", request.hashedPassword());
            response.put("matches", matches);

            logger.debug("Verificación de contraseña: {}", response);

            return ResponseEntity.ok(new ApiResponse(true, "Verificación de contraseña", response));
        } catch (Exception e) {
            logger.error("Error al verificar contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error al verificar contraseña: " + e.getMessage()));
        }
    }

    private record PasswordRequest(String password) {}
    private record VerifyRequest(String rawPassword, String hashedPassword) {}
}
