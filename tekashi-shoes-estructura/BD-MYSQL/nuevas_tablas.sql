-- Script para crear las nuevas tablas del sistema mejorado
-- Ejecutar después de la base de datos principal

USE tekashi_shoes_bd;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('ADMIN', 'CLIENTE') DEFAULT 'CLIENTE',
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATE DEFAULT (CURRENT_DATE)
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS review (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT,
    fecha DATE DEFAULT (CURRENT_DATE),
    verificado BOOLEAN DEFAULT FALSE,
    util INT DEFAULT 0,
    no_util INT DEFAULT 0,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla de carrito de compras
CREATE TABLE IF NOT EXISTS carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (id_usuario, id_producto)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',
    total DECIMAL(10,2) NOT NULL,
    direccion_envio TEXT,
    telefono_contacto VARCHAR(20),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla de detalles de pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') DEFAULT 'INFO',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Insertar usuario administrador por defecto
INSERT INTO usuario (nombre, email, password, rol, activo) 
VALUES ('Administrador', 'admin@tekashi.com', 'admin123', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar algunos usuarios de ejemplo
INSERT INTO usuario (nombre, email, password, telefono, direccion, rol, activo) VALUES
('María González', 'maria@email.com', 'password123', '3001234567', 'Calle 123 #45-67, Bogotá', 'CLIENTE', TRUE),
('Carlos Rodríguez', 'carlos@email.com', 'password123', '3007654321', 'Carrera 45 #78-90, Medellín', 'CLIENTE', TRUE),
('Ana Martínez', 'ana@email.com', 'password123', '3009876543', 'Avenida 80 #12-34, Cali', 'CLIENTE', TRUE)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar algunas reseñas de ejemplo
INSERT INTO review (id_producto, id_usuario, rating, comentario, verificado, util, no_util) VALUES
(10, 2, 5, 'Excelente calidad, muy cómodos y duraderos. Los recomiendo totalmente.', TRUE, 12, 1),
(10, 3, 4, 'Buen producto, se ajusta perfectamente. La entrega fue rápida.', TRUE, 8, 0),
(16, 2, 5, 'Super cómodos, perfectos para el día a día. Calidad premium.', FALSE, 15, 2),
(16, 4, 3, 'Están bien, pero esperaba un poco más de calidad por el precio.', TRUE, 5, 3)
ON DUPLICATE KEY UPDATE comentario = VALUES(comentario);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_review_producto ON review(id_producto);
CREATE INDEX idx_review_usuario ON review(id_usuario);
CREATE INDEX idx_carrito_usuario ON carrito(id_usuario);
CREATE INDEX idx_favoritos_usuario ON favoritos(id_usuario);
CREATE INDEX idx_pedido_usuario ON pedido(id_usuario);
CREATE INDEX idx_notificacion_usuario ON notificacion(id_usuario);

-- Crear vista para estadísticas de productos
CREATE VIEW vista_estadisticas_productos AS
SELECT 
    p.id_producto,
    p.marca,
    p.precio,
    p.stock,
    COUNT(r.id_review) as total_reviews,
    COALESCE(AVG(r.rating), 0) as rating_promedio,
    COUNT(f.id_favorito) as total_favoritos,
    COUNT(c.id_carrito) as total_carrito
FROM producto p
LEFT JOIN review r ON p.id_producto = r.id_producto
LEFT JOIN favoritos f ON p.id_producto = f.id_producto
LEFT JOIN carrito c ON p.id_producto = c.id_producto
GROUP BY p.id_producto, p.marca, p.precio, p.stock;

-- Crear vista para estadísticas de usuarios
CREATE VIEW vista_estadisticas_usuarios AS
SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    u.fecha_registro,
    COUNT(p.id_pedido) as total_pedidos,
    COALESCE(SUM(p.total), 0) as total_gastado,
    COUNT(f.id_favorito) as total_favoritos,
    COUNT(r.id_review) as total_reviews
FROM usuario u
LEFT JOIN pedido p ON u.id_usuario = p.id_usuario
LEFT JOIN favoritos f ON u.id_usuario = f.id_usuario
LEFT JOIN review r ON u.id_usuario = r.id_usuario
WHERE u.activo = TRUE
GROUP BY u.id_usuario, u.nombre, u.email, u.fecha_registro;

-- Mostrar mensaje de confirmación
SELECT 'Nuevas tablas creadas exitosamente' as mensaje;
