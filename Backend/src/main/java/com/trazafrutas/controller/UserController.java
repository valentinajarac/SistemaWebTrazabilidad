package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private ResponseEntity<?> checkAdminRole(User user) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Solo los administradores pueden gestionar usuarios"));
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse(true, "Usuarios obtenidos exitosamente", users));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener los usuarios: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            User foundUser = userService.getUserById(id);
            // No enviar la contraseña en la respuesta
            foundUser.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario encontrado", foundUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User newUser, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            User createdUser = userService.createUser(newUser);
            // No enviar la contraseña en la respuesta
            createdUser.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario creado exitosamente", createdUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al crear el usuario: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            User result = userService.updateUser(id, updatedUser);
            // No enviar la contraseña en la respuesta
            result.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario actualizado exitosamente", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al actualizar el usuario: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            // No permitir eliminar al usuario administrador principal
            if (id == 1) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "No se puede eliminar al administrador principal"));
            }

            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}