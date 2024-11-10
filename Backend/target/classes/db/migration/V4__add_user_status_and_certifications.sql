-- V4__add_user_status_and_certifications.sql
-- Primero eliminamos la tabla si existe para evitar conflictos
DROP TABLE IF EXISTS user_certifications;

-- Agregar columna de estado a la tabla users si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name='users' AND column_name='status') THEN
        ALTER TABLE users
        ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVO';
    END IF;
END $$;

-- Crear tabla para certificaciones de usuarios
CREATE TABLE IF NOT EXISTS user_certifications (
    user_id BIGINT NOT NULL,
    certification VARCHAR(50) NOT NULL,
    CONSTRAINT pk_user_certifications PRIMARY KEY (user_id, certification),
    CONSTRAINT fk_user_certifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_certifications_certification
    ON user_certifications(certification);

-- Actualizar usuarios existentes
UPDATE users SET status = 'ACTIVO' WHERE status IS NULL;
