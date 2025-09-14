-- Sistema de Roles y Funcionalidades de Usuario
-- Tekashi Shoes Platform

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto
INSERT INTO roles (nombre_rol, descripcion) VALUES
('admin', 'Administrador del sistema con acceso completo'),
('user', 'Usuario estándar con funcionalidades básicas y avanzadas'),
('guest', 'Usuario invitado con acceso limitado');

-- Actualizar tabla usuarios para incluir roles
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS id_rol INT DEFAULT 2,
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20),
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultima_conexion TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS estado_cuenta ENUM('activa', 'inactiva', 'suspendida') DEFAULT 'activa',
ADD COLUMN IF NOT EXISTS puntos_fidelidad INT DEFAULT 0,
ADD FOREIGN KEY (id_rol) REFERENCES roles(id_rol);

-- Tabla de funcionalidades por rol
CREATE TABLE IF NOT EXISTS funcionalidades_rol (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_rol INT,
    funcionalidad VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Funcionalidades para usuarios (rol 'user')
INSERT INTO funcionalidades_rol (id_rol, funcionalidad, descripcion) VALUES
(2, 'comprar_productos', 'Poder agregar productos al carrito y realizar compras'),
(2, 'ver_historial_compras', 'Acceder al historial de compras realizadas'),
(2, 'gestionar_perfil', 'Editar información personal y preferencias'),
(2, 'agregar_favoritos', 'Marcar productos como favoritos'),
(2, 'dejar_resenas', 'Escribir reseñas de productos comprados'),
(2, 'sistema_puntos', 'Acumular y canjear puntos de fidelidad'),
(2, 'notificaciones_personalizadas', 'Recibir notificaciones sobre ofertas y nuevos productos'),
(2, 'wishlist', 'Crear y gestionar listas de deseos'),
(2, 'comparar_productos', 'Comparar características de diferentes productos'),
(2, 'seguimiento_pedidos', 'Rastrear el estado de pedidos en tiempo real'),
(2, 'programar_recordatorios', 'Programar recordatorios para recompra'),
(2, 'descuentos_exclusivos', 'Acceder a descuentos exclusivos para usuarios'),
(2, 'soporte_prioritario', 'Recibir soporte prioritario'),
(2, 'early_access', 'Acceso temprano a nuevos productos');

-- Funcionalidades para admin (rol 'admin')
INSERT INTO funcionalidades_rol (id_rol, funcionalidad, descripcion) VALUES
(1, 'gestionar_productos', 'Crear, editar y eliminar productos'),
(1, 'gestionar_usuarios', 'Administrar cuentas de usuarios'),
(1, 'ver_estadisticas', 'Acceder a dashboard con métricas del negocio'),
(1, 'gestionar_inventario', 'Controlar stock y disponibilidad'),
(1, 'gestionar_pedidos', 'Administrar órdenes de compra'),
(1, 'gestionar_categorias', 'Crear y administrar categorías de productos');

-- Tabla de historial de compras
CREATE TABLE IF NOT EXISTS historial_compras (
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50),
    direccion_envio TEXT,
    tracking_number VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de items de compra
CREATE TABLE IF NOT EXISTS items_compra (
    id_item INT PRIMARY KEY AUTO_INCREMENT,
    id_compra INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES historial_compras(id_compra),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_producto INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    UNIQUE KEY unique_favorito (id_usuario, id_producto)
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reseñas (
    id_resena INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_producto INT,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    UNIQUE KEY unique_resena (id_usuario, id_producto)
);

-- Tabla de wishlist
CREATE TABLE IF NOT EXISTS wishlist (
    id_wishlist INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    nombre_lista VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de items de wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
    id_item INT PRIMARY KEY AUTO_INCREMENT,
    id_wishlist INT,
    id_producto INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_wishlist) REFERENCES wishlist(id_wishlist),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    UNIQUE KEY unique_wishlist_item (id_wishlist, id_producto)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    tipo ENUM('oferta', 'nuevo_producto', 'pedido', 'general') DEFAULT 'general',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de puntos de fidelidad
CREATE TABLE IF NOT EXISTS puntos_fidelidad (
    id_punto INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    puntos_ganados INT NOT NULL,
    puntos_canjeados INT DEFAULT 0,
    razon VARCHAR(200),
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Insertar usuario admin por defecto
INSERT INTO usuarios (nombre, email, contraseña, id_rol, estado_cuenta) VALUES
('Administrador', 'admin@tekashishoes.com', 'admin123', 1, 'activa');

-- Insertar usuario de prueba
INSERT INTO usuarios (nombre, email, contraseña, id_rol, telefono, direccion, estado_cuenta, puntos_fidelidad) VALUES
('Usuario Demo', 'user@demo.com', 'user123', 2, '+57 300 123 4567', 'Calle 123 #45-67, Bogotá', 'activa', 150);

-- Crear índices para optimizar consultas
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_historial_usuario ON historial_compras(id_usuario);
CREATE INDEX idx_favoritos_usuario ON favoritos(id_usuario);
CREATE INDEX idx_resenas_producto ON reseñas(id_producto);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(id_usuario);
