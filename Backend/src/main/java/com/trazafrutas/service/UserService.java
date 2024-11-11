package com.trazafrutas.service;

import com.trazafrutas.exception.EntityNotFoundException;
import com.trazafrutas.model.User;
import com.trazafrutas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public User createUser(User user) {
        validateUserData(user);
        logger.debug("Validando datos de nuevo usuario: {}", user.getUsuario());

        // Verificar duplicados
        if (userRepository.existsByUsuario(user.getUsuario())) {
            throw new IllegalArgumentException("Ya existe un usuario con el nombre de usuario: " + user.getUsuario());
        }
        if (userRepository.existsByCedula(user.getCedula())) {
            throw new IllegalArgumentException("Ya existe un usuario con la cédula: " + user.getCedula());
        }
        if (userRepository.existsByCodigoTrazabilidad(user.getCodigoTrazabilidad())) {
            throw new IllegalArgumentException("Ya existe un usuario con el código de trazabilidad: " + user.getCodigoTrazabilidad());
        }

        // Encriptar contraseña
        String rawPassword = user.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);

        logger.debug("Contraseña encriptada para usuario: {}", user.getUsuario());

        User savedUser = userRepository.save(user);
        logger.debug("Usuario guardado exitosamente: {}", savedUser.getUsuario());

        return savedUser;
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);
        logger.debug("Actualizando usuario: {}", existingUser.getUsuario());

        // Validar y actualizar cédula
        if (updatedUser.getCedula() != null) {
            if (!existingUser.getCedula().equals(updatedUser.getCedula()) &&
                    userRepository.existsByCedula(updatedUser.getCedula())) {
                throw new IllegalArgumentException("Ya existe un usuario con la cédula: " + updatedUser.getCedula());
            }
            if (!updatedUser.getCedula().matches("\\d{7,10}")) {
                throw new IllegalArgumentException("La cédula debe tener entre 7 y 10 dígitos");
            }
            existingUser.setCedula(updatedUser.getCedula());
        }

        // Validar y actualizar nombre completo
        if (updatedUser.getNombreCompleto() != null) {
            if (updatedUser.getNombreCompleto().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre completo no puede estar vacío");
            }
            existingUser.setNombreCompleto(updatedUser.getNombreCompleto());
        }

        // Validar y actualizar código de trazabilidad
        if (updatedUser.getCodigoTrazabilidad() != null) {
            if (!existingUser.getCodigoTrazabilidad().equals(updatedUser.getCodigoTrazabilidad()) &&
                    userRepository.existsByCodigoTrazabilidad(updatedUser.getCodigoTrazabilidad())) {
                throw new IllegalArgumentException("Ya existe un usuario con el código de trazabilidad: " + updatedUser.getCodigoTrazabilidad());
            }
            existingUser.setCodigoTrazabilidad(updatedUser.getCodigoTrazabilidad());
        }

        // Validar y actualizar municipio
        if (updatedUser.getMunicipio() != null) {
            if (updatedUser.getMunicipio().trim().isEmpty()) {
                throw new IllegalArgumentException("El municipio no puede estar vacío");
            }
            existingUser.setMunicipio(updatedUser.getMunicipio());
        }

        // Validar y actualizar teléfono
        if (updatedUser.getTelefono() != null) {
            if (!updatedUser.getTelefono().matches("\\d{10}")) {
                throw new IllegalArgumentException("El teléfono debe tener 10 dígitos");
            }
            existingUser.setTelefono(updatedUser.getTelefono());
        }

        // Validar y actualizar nombre de usuario
        if (updatedUser.getUsuario() != null) {
            if (!existingUser.getUsuario().equals(updatedUser.getUsuario()) &&
                    userRepository.existsByUsuario(updatedUser.getUsuario())) {
                throw new IllegalArgumentException("Ya existe un usuario con el nombre de usuario: " + updatedUser.getUsuario());
            }
            if (updatedUser.getUsuario().length() < 4) {
                throw new IllegalArgumentException("El nombre de usuario debe tener al menos 4 caracteres");
            }
            existingUser.setUsuario(updatedUser.getUsuario());
        }

        // Validar y actualizar contraseña solo si se proporciona una nueva
        String newPassword = updatedUser.getPassword();
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            if (newPassword.length() < 6) {
                throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
            }
            existingUser.setPassword(passwordEncoder.encode(newPassword));
            logger.debug("Contraseña actualizada para usuario: {}", existingUser.getUsuario());
        }

        // Actualizar rol si se proporciona
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        // Actualizar estado si se proporciona
        if (updatedUser.getStatus() != null) {
            existingUser.setStatus(updatedUser.getStatus());
        }

        // Actualizar certificaciones si se proporcionan
        if (updatedUser.getCertifications() != null) {
            existingUser.setCertifications(updatedUser.getCertifications());
        }

        User savedUser = userRepository.save(existingUser);
        logger.debug("Usuario actualizado exitosamente: {}", savedUser.getUsuario());

        return savedUser;
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
        logger.debug("Usuario eliminado exitosamente, ID: {}", id);
    }

    private void validateUserData(User user) {
        StringBuilder errors = new StringBuilder();

        if (user.getCedula() == null || user.getCedula().trim().isEmpty()) {
            errors.append("La cédula es requerida. ");
        } else if (!user.getCedula().matches("\\d{7,10}")) {
            errors.append("La cédula debe tener entre 7 y 10 dígitos. ");
        }

        if (user.getNombreCompleto() == null || user.getNombreCompleto().trim().isEmpty()) {
            errors.append("El nombre completo es requerido. ");
        }

        if (user.getCodigoTrazabilidad() == null || user.getCodigoTrazabilidad().trim().isEmpty()) {
            errors.append("El código de trazabilidad es requerido. ");
        }

        if (user.getMunicipio() == null || user.getMunicipio().trim().isEmpty()) {
            errors.append("El municipio es requerido. ");
        }

        if (user.getTelefono() == null || user.getTelefono().trim().isEmpty()) {
            errors.append("El teléfono es requerido. ");
        } else if (!user.getTelefono().matches("\\d{10}")) {
            errors.append("El teléfono debe tener 10 dígitos. ");
        }

        if (user.getUsuario() == null || user.getUsuario().trim().isEmpty()) {
            errors.append("El nombre de usuario es requerido. ");
        } else if (user.getUsuario().length() < 4) {
            errors.append("El nombre de usuario debe tener al menos 4 caracteres. ");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            errors.append("La contraseña es requerida. ");
        } else if (user.getPassword().length() < 6) {
            errors.append("La contraseña debe tener al menos 6 caracteres. ");
        }

        if (user.getRole() == null) {
            errors.append("El rol es requerido. ");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString().trim());
        }
    }
}