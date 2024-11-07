-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_usuario ON users(usuario);
CREATE INDEX idx_users_cedula ON users(cedula);
CREATE INDEX idx_users_codigo_trazabilidad ON users(codigo_trazabilidad);

CREATE INDEX idx_clients_nit ON clients(nit);
CREATE INDEX idx_clients_floid ON clients(floid);

CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_farms_nombre_municipio ON farms(nombre, municipio);

CREATE INDEX idx_crops_farm_id ON crops(farm_id);
CREATE INDEX idx_crops_user_id ON crops(user_id);
CREATE INDEX idx_crops_producto_estado ON crops(producto, estado);

CREATE INDEX idx_remissions_user_id ON remissions(user_id);
CREATE INDEX idx_remissions_farm_id ON remissions(farm_id);
CREATE INDEX idx_remissions_crop_id ON remissions(crop_id);
CREATE INDEX idx_remissions_client_id ON remissions(client_id);
CREATE INDEX idx_remissions_fecha_despacho ON remissions(fecha_despacho);
CREATE INDEX idx_remissions_producto ON remissions(producto);