-- Script para crear la tabla de usuarios
USE tekashi_shoes;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('user', 'admin') DEFAULT 'user',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    puntos_fidelidad INT DEFAULT 0,
    nivel_usuario ENUM('bronce', 'plata', 'oro', 'diamante') DEFAULT 'bronce',
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado),
    INDEX idx_fecha_registro (fecha_registro)
);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol, estado, puntos_fidelidad, nivel_usuario) 
VALUES ('Administrador', 'admin@tekashi.com', 'admin123', 'admin', 'activo', 1000, 'diamante')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar usuario de prueba
INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol, estado, puntos_fidelidad, nivel_usuario) 
VALUES ('Usuario Prueba', 'usuario@test.com', 'test123', '3001234567', 'Calle 123 #45-67', 'user', 'activo', 150, 'plata')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, producto_id),
    INDEX idx_usuario_favorito (usuario_id),
    INDEX idx_producto_favorito (producto_id)
);

-- Crear tabla de listas de deseos
CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_wishlist (usuario_id)
);

-- Crear tabla de productos en wishlist
CREATE TABLE IF NOT EXISTS wishlist_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id INT NOT NULL,
    producto_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_producto (wishlist_id, producto_id),
    INDEX idx_wishlist_producto (wishlist_id),
    INDEX idx_producto_wishlist (producto_id)
);

-- Crear tabla de historial de compras
CREATE TABLE IF NOT EXISTS historial_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE,
    INDEX idx_usuario_compra (usuario_id),
    INDEX idx_producto_compra (producto_id),
    INDEX idx_fecha_compra (fecha_compra)
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_notificacion (usuario_id),
    INDEX idx_leida (leida),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Crear tabla de reseñas
CREATE TABLE IF NOT EXISTS reseñas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE,
    UNIQUE KEY unique_resena (usuario_id, producto_id),
    INDEX idx_usuario_resena (usuario_id),
    INDEX idx_producto_resena (producto_id),
    INDEX idx_calificacion (calificacion)
);

-- Insertar algunas notificaciones de ejemplo
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo) VALUES
(2, '¡Bienvenido a Tekashi Shoes!', 'Gracias por registrarte. ¡Disfruta de tu experiencia de compra!', 'success'),
(2, 'Oferta especial', '¡No te pierdas nuestras ofertas de temporada! Descuentos hasta del 50%', 'info'),
(2, 'Puntos de fidelidad', 'Has ganado 10 puntos de fidelidad por tu compra. ¡Sigue acumulando!', 'success');

-- Insertar algunos favoritos de ejemplo
INSERT INTO favoritos (usuario_id, producto_id) VALUES
(2, 1),
(2, 3),
(2, 5);

-- Insertar una lista de deseos de ejemplo
INSERT INTO wishlists (usuario_id, nombre, descripcion) VALUES
(2, 'Zapatos de Verano', 'Zapatos cómodos para el verano'),
(2, 'Zapatos Deportivos', 'Para correr y hacer ejercicio');

-- Insertar productos en la wishlist
INSERT INTO wishlist_productos (wishlist_id, producto_id) VALUES
(1, 2),
(1, 4),
(2, 6),
(2, 8);

-- Insertar historial de compras de ejemplo
INSERT INTO historial_compras (usuario_id, producto_id, cantidad, precio_unitario, total, estado) VALUES
(2, 1, 1, 150000.00, 150000.00, 'entregado'),
(2, 3, 2, 120000.00, 240000.00, 'enviado'),
(2, 5, 1, 200000.00, 200000.00, 'pendiente');

-- Insertar reseñas de ejemplo
INSERT INTO reseñas (usuario_id, producto_id, calificacion, comentario) VALUES
(2, 1, 5, 'Excelentes zapatos, muy cómodos y de buena calidad'),
(2, 3, 4, 'Buenos zapatos, se ven exactamente como en la foto'),
(2, 5, 5, 'Perfectos para el trabajo, muy elegantes');

-- Mostrar información de las tablas creadas
SELECT 'Tablas creadas exitosamente:' as mensaje;
SHOW TABLES LIKE '%usuario%' OR LIKE '%favorito%' OR LIKE '%wishlist%' OR LIKE '%historial%' OR LIKE '%notificacion%' OR LIKE '%reseña%';