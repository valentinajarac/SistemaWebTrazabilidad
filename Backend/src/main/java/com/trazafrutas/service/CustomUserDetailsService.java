package com.trazafrutas.service;

import com.trazafrutas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Buscando usuario por nombre de usuario: {}", username);

        return userRepository.findByUsuario(username)
                .map(user -> {
                    logger.debug("Usuario encontrado: {}", user.getUsuario());
                    logger.debug("Password hash almacenado: {}", user.getPassword());
                    logger.debug("Rol del usuario: {}", user.getRole());
                    logger.debug("Estado del usuario: {}", user.getStatus());
                    return user;
                })
                .orElseThrow(() -> {
                    logger.error("Usuario no encontrado: {}", username);
                    return new UsernameNotFoundException("Usuario no encontrado: " + username);
                });
    }
}