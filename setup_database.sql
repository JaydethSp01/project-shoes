-- Configuración inicial de MySQL para el proyecto Tekashi Shoes
CREATE DATABASE IF NOT EXISTS tekashi_shoes_bd;
USE tekashi_shoes_bd;

-- Crear usuario para la aplicación
CREATE USER IF NOT EXISTS 'tekashi_user'@'localhost' IDENTIFIED BY 'Tekashi123!';
GRANT ALL PRIVILEGES ON tekashi_shoes_bd.* TO 'tekashi_user'@'localhost';
FLUSH PRIVILEGES;

-- Mostrar información
SELECT 'Base de datos configurada correctamente' as status;
SHOW DATABASES;
