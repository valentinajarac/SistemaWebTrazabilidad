-- Crear función para actualizar estado automáticamente
CREATE OR REPLACE FUNCTION update_crop_status()
RETURNS TRIGGER AS $$
DECLARE
    meses_transcurridos INTEGER;
    meses_produccion INTEGER;
BEGIN
    -- Calcular meses transcurridos desde la siembra
    meses_transcurridos := EXTRACT(YEAR FROM age(CURRENT_DATE, NEW.fecha_siembra)) * 12 +
                          EXTRACT(MONTH FROM age(CURRENT_DATE, NEW.fecha_siembra));

    -- Determinar meses necesarios según el producto
    IF NEW.producto = 'UCHUVA' THEN
        meses_produccion := 5;
    ELSE -- GULUPA
        meses_produccion := 10;
    END IF;

    -- Actualizar estado basado en meses transcurridos
    IF meses_transcurridos >= meses_produccion THEN
        NEW.estado := 'PRODUCCION';
    ELSE
        NEW.estado := 'VEGETACION';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar estado
DROP TRIGGER IF EXISTS trigger_update_crop_status ON crops;
CREATE TRIGGER trigger_update_crop_status
    BEFORE INSERT OR UPDATE OF fecha_siembra, producto ON crops
    FOR EACH ROW
    EXECUTE FUNCTION update_crop_status();