-- Insertar usuario administrador por defecto
INSERT INTO users (
    cedula,
    nombre_completo,
    codigo_trazabilidad,
    municipio,
    telefono,
    usuario,
    password,
    role
) VALUES (
    '1234567890',
    'Administrador Sistema',
    'ADMIN001',
    'Bogotá',
    '3001234567',
    'admin',
    -- Contraseña: admin123 (hasheada con BCrypt)
    '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRYIRlR29mxZcEAnNAq9jqVHEGzBwe',
    'ADMIN'
);