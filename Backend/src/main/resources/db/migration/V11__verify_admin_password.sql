-- Verificar el usuario admin actual
SELECT usuario, password FROM users WHERE usuario = 'admin';

-- Actualizar la contraseña del admin con un nuevo hash
UPDATE users
SET password = '$2a$10$dQEi5rX.QU6hEGO9BqKzBOYIxiNPZHXhAZSKjoxlsNz1gZ51h7fb6'
WHERE usuario = 'admin'
RETURNING usuario, password;