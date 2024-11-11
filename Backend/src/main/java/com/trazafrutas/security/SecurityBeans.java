package com.trazafrutas.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SecurityBeans {
    private static final Logger logger = LoggerFactory.getLogger(SecurityBeans.class);

    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        // Test de codificación
        String testPassword = "admin123";
        String encoded = encoder.encode(testPassword);
        logger.debug("Test password: {}", testPassword);
        logger.debug("Encoded password: {}", encoded);

        return encoder;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        logger.debug("Creando AuthenticationManager");
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        logger.debug("Configurando DaoAuthenticationProvider");
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        // Test de configuración
        logger.debug("UserDetailsService configurado: {}", userDetailsService.getClass().getName());
        logger.debug("PasswordEncoder configurado: {}", passwordEncoder.getClass().getName());

        return authProvider;
    }
}