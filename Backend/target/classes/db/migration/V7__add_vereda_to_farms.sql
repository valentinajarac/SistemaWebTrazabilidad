-- Agregar columna vereda a la tabla farms
ALTER TABLE farms
ADD COLUMN vereda VARCHAR(100);

-- Actualizar registros existentes con un valor por defecto
UPDATE farms SET vereda = 'Sin especificar' WHERE vereda IS NULL;