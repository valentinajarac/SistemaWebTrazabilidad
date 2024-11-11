-- Limpiar datos existentes
TRUNCATE TABLE users CASCADE;

-- Insertar usuario administrador
INSERT INTO users (
    cedula,
    nombre_completo,
    codigo_trazabilidad,
    municipio,
    telefono,
    usuario,
    password,
    role,
    status
) VALUES (
    '1234567890',
    'Administrador Sistema',
    'ADMIN001',
    'Bogotá',
    '3001234567',
    'admin',
    -- Contraseña: admin123 (BCrypt)
    '$2a$10$DaWzKFk1h3Vk8rKHGxvCp.LZpUk2qkKxY5Jy9H4ZEqD4kKvqFLtcO',
    'ADMIN',
    'ACTIVO'
);