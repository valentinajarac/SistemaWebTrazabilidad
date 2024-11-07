package com.trazafrutas.config;

import com.trazafrutas.model.User;
import com.trazafrutas.model.enums.Role;
import com.trazafrutas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class InitialDataConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Verificar si ya existe un usuario admin
            if (!userRepository.existsByUsuario("admin")) {
                try {
                    // Crear usuario administrador
                    User adminUser = new User();
                    adminUser.setUsuario("admin");
                    adminUser.setPassword(passwordEncoder.encode("admin123"));
                    adminUser.setCedula("1234567890");
                    adminUser.setNombreCompleto("Administrador Sistema");
                    adminUser.setCodigoTrazabilidad("ADMIN001");
                    adminUser.setMunicipio("Bogotá");
                    adminUser.setTelefono("3001234567");
                    adminUser.setRole(Role.ADMIN); // Asegurarse de que el rol sea ADMIN

                    userRepository.save(adminUser);
                    System.out.println("Usuario administrador creado exitosamente");
                } catch (Exception e) {
                    System.err.println("Error al crear usuario administrador: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        };
    }
}