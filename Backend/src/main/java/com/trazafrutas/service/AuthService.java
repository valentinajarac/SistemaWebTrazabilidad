package com.trazafrutas.service;

import com.trazafrutas.dto.AuthRequest;
import com.trazafrutas.dto.AuthResponse;
import com.trazafrutas.model.User;
import com.trazafrutas.repository.UserRepository;
import com.trazafrutas.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse authenticate(AuthRequest request) {
        try {
            logger.debug("Iniciando proceso de autenticación para usuario: {}", request.getUsername());

            // 1. Verificar que el usuario existe
            User user = userRepository.findByUsuario(request.getUsername())
                    .orElseThrow(() -> {
                        logger.error("Usuario no encontrado: {}", request.getUsername());
                        return new BadCredentialsException("Usuario no encontrado");
                    });

            logger.debug("Usuario encontrado en la base de datos: {}", user.getUsuario());
            logger.debug("Hash almacenado en la base de datos: {}", user.getPassword());

            // 2. Verificar la contraseña directamente
            String rawPassword = request.getPassword();
            boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword());

            logger.debug("Contraseña proporcionada: {}", rawPassword);
            logger.debug("¿La contraseña coincide?: {}", passwordMatches);

            if (!passwordMatches) {
                logger.error("La contraseña no coincide para el usuario: {}", user.getUsuario());
                throw new BadCredentialsException("Contraseña incorrecta");
            }

            // 3. Crear el token de autenticación
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    user,
                    rawPassword,
                    user.getAuthorities()
            );

            logger.debug("Token de autenticación creado, intentando autenticar...");

            // 4. Autenticar usando el AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(authToken);

            logger.debug("Autenticación exitosa, generando JWT...");

            // 5. Generar el JWT
            String token = jwtService.generateToken(user);

            logger.debug("JWT generado exitosamente");

            // 6. Construir y retornar la respuesta
            return AuthResponse.builder()
                    .token(token)
                    .role(user.getRole().toString())
                    .userId(user.getId())
                    .username(user.getUsuario())
                    .build();

        } catch (BadCredentialsException e) {
            logger.error("Error de autenticación para usuario {}: {}", request.getUsername(), e.getMessage());
            throw new BadCredentialsException("Credenciales inválidas");
        } catch (Exception e) {
            logger.error("Error inesperado durante la autenticación: {}", e.getMessage(), e);
            throw new BadCredentialsException("Error en el proceso de autenticación");
        }
    }
}