-- Tabla para usuarios y compras
-- Ejecutar después de las tablas principales

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de compras
CREATE TABLE IF NOT EXISTS compra (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta', 'efectivo', 'transferencia') NOT NULL,
    direccion_envio TEXT NOT NULL,
    telefono_envio VARCHAR(20),
    notas TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Crear tabla de items de compra
CREATE TABLE IF NOT EXISTS item_compra (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Insertar algunos usuarios de prueba
INSERT INTO usuario (nombre, apellido, email, telefono, direccion, ciudad, codigo_postal) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '3001234567', 'Calle 123 #45-67', 'Bogotá', '110111'),
('María', 'González', 'maria.gonzalez@email.com', '3002345678', 'Carrera 45 #78-90', 'Medellín', '050001'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '3003456789', 'Avenida 68 #12-34', 'Cali', '760001'),
('Ana', 'Martínez', 'ana.martinez@email.com', '3004567890', 'Calle 80 #56-78', 'Barranquilla', '080001'),
('Luis', 'Fernández', 'luis.fernandez@email.com', '3005678901', 'Carrera 15 #23-45', 'Cartagena', '130001');

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_compra_usuario ON compra(id_usuario);
CREATE INDEX idx_compra_fecha ON compra(fecha_compra);
CREATE INDEX idx_item_compra ON item_compra(id_compra);
