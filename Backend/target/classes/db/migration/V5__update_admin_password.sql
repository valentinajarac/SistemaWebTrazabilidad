-- Actualizar la contraseña del usuario admin
-- La nueva contraseña es: admin123
UPDATE users
SET password = '$2a$10$DaWzKFk1h3Vk8rKHGxvCp.LZpUk2qkKxY5Jy9H4ZEqD4kKvqFLtcO'
WHERE usuario = 'admin';