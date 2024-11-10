-- Actualizar los valores existentes
UPDATE users SET status = 'ACTIVO' WHERE status = 'ACTIVE';
UPDATE users SET status = 'INACTIVO' WHERE status = 'INACTIVE';

-- Agregar restricción de tipo enum
ALTER TABLE users
  ADD CONSTRAINT chk_user_status
  CHECK (status IN ('ACTIVO', 'INACTIVO'));