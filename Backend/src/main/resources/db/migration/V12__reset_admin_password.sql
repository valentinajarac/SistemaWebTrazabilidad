-- V12__reset_admin_password.sql
TRUNCATE TABLE user_certifications CASCADE;
TRUNCATE TABLE remissions CASCADE;
TRUNCATE TABLE crops CASCADE;
TRUNCATE TABLE farms CASCADE;
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
    '$2a$10$pcjlzCj2sqM108FzCaKFWuH95qoat7y3z.fUh5pCH3yChDGPXCHwq',
    'ADMIN',
    'ACTIVO'
);
