-- Limpiar todas las tablas que dependen de users
TRUNCATE TABLE user_certifications CASCADE;
TRUNCATE TABLE remissions CASCADE;
TRUNCATE TABLE crops CASCADE;
TRUNCATE TABLE farms CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insertar el usuario admin con una contraseña conocida
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
    '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW',
    'ADMIN',
    'ACTIVO'
);