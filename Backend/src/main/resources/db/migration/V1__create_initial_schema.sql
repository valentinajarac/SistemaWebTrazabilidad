-- Crear tipos ENUM
DO $$
BEGIN
    CREATE TYPE role_type AS ENUM ('ADMIN', 'PRODUCER');
    CREATE TYPE product_type AS ENUM ('UCHUVA', 'GULUPA');
    CREATE TYPE crop_status AS ENUM ('PRODUCCION', 'VEGETACION');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(100) NOT NULL,
    codigo_trazabilidad VARCHAR(20) NOT NULL UNIQUE,
    municipio VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role role_type NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    nit VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    floid VARCHAR(4) NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fincas
CREATE TABLE IF NOT EXISTS farms (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    hectareas DECIMAL(10,2) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    vereda VARCHAR(100),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_farms_nombre_user UNIQUE(nombre, user_id)
);

-- Tabla de cultivos
CREATE TABLE IF NOT EXISTS crops (
    id BIGSERIAL PRIMARY KEY,
    numero_plants INTEGER NOT NULL,
    hectareas DECIMAL(10,2) NOT NULL,
    fecha_siembra DATE NOT NULL DEFAULT CURRENT_DATE,
    producto product_type NOT NULL,
    estado crop_status NOT NULL,
    farm_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_crops_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    CONSTRAINT fk_crops_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de remisiones
CREATE TABLE IF NOT EXISTS remissions (
    id BIGSERIAL PRIMARY KEY,
    fecha_despacho DATE NOT NULL,
    canastillas_enviadas INTEGER NOT NULL,
    kilos_promedio DECIMAL(10,2) NOT NULL,
    total_kilos DECIMAL(10,2) NOT NULL,
    producto product_type NOT NULL,
    user_id BIGINT NOT NULL,
    farm_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_remissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_remissions_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    CONSTRAINT fk_remissions_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    CONSTRAINT fk_remissions_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabla de certificaciones de usuarios
CREATE TABLE IF NOT EXISTS user_certifications (
    user_id BIGINT NOT NULL,
    certification VARCHAR(50) NOT NULL,
    CONSTRAINT pk_user_certifications PRIMARY KEY (user_id, certification),
    CONSTRAINT fk_user_certifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Triggers para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_farms_updated_at ON farms;
CREATE TRIGGER update_farms_updated_at
    BEFORE UPDATE ON farms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crops_updated_at ON crops;
CREATE TRIGGER update_crops_updated_at
    BEFORE UPDATE ON crops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_remissions_updated_at ON remissions;
CREATE TRIGGER update_remissions_updated_at
    BEFORE UPDATE ON remissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();