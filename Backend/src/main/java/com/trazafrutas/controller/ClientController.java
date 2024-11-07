package com.trazafrutas.controller;

import com.trazafrutas.dto.ApiResponse;
import com.trazafrutas.model.Client;
import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    private ResponseEntity<?> checkAdminRole(User user) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Solo los administradores pueden gestionar clientes"));
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getAllClients(@AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            List<Client> clients = clientService.getAllClients();
            return ResponseEntity.ok(new ApiResponse(true, "Clientes obtenidos exitosamente", clients));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al obtener los clientes: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Client client = clientService.getClientById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Cliente encontrado", client));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody Client client, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Client newClient = clientService.createClient(client);
            return ResponseEntity.ok(new ApiResponse(true, "Cliente creado exitosamente", newClient));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al crear el cliente: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(
            @PathVariable Long id,
            @RequestBody Client client,
            @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            Client updatedClient = clientService.updateClient(id, client);
            return ResponseEntity.ok(new ApiResponse(true, "Cliente actualizado exitosamente", updatedClient));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error al actualizar el cliente: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ResponseEntity<?> roleCheck = checkAdminRole(user);
        if (roleCheck != null) return roleCheck;

        try {
            clientService.deleteClient(id);
            return ResponseEntity.ok(new ApiResponse(true, "Cliente eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}