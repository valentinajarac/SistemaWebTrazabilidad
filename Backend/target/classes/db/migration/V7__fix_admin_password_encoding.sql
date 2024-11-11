-- Limpiar y reinsertar el usuario admin con la contraseña correcta
TRUNCATE TABLE users CASCADE;

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
    -- Contraseña: admin123 (BCrypt con 10 rondas)
    '$2a$10$n9HJl8UV4RBxkxXUXpGvOOXwzUq.xiKhwWGgMEqGMtDWzuknhxKDi',
    'ADMIN',
    'ACTIVO'
);