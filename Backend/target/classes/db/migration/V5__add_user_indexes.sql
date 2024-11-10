-- Agregar índices si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                  WHERE c.relname = 'idx_users_cedula' AND n.nspname = 'public') THEN
        CREATE INDEX idx_users_cedula ON users(cedula);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                  WHERE c.relname = 'idx_users_codigo_trazabilidad' AND n.nspname = 'public') THEN
        CREATE INDEX idx_users_codigo_trazabilidad ON users(codigo_trazabilidad);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                  WHERE c.relname = 'idx_users_status' AND n.nspname = 'public') THEN
        CREATE INDEX idx_users_status ON users(status);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                  WHERE c.relname = 'idx_user_certifications_user_cert' AND n.nspname = 'public') THEN
        CREATE INDEX idx_user_certifications_user_cert
        ON user_certifications(user_id, certification);
    END IF;
END $$;