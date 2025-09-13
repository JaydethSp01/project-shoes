-- Datos adicionales para hacer la tienda más realista
-- Ejecutar después de las tablas principales

-- Insertar más tipos de producto
INSERT INTO tipo_producto (nombre) VALUES
('Sneakers'),
('Running'),
('Basketball'),
('Casual'),
('Formal'),
('Sandals'),
('Boots'),
('Heels');

-- Insertar más productos realistas
INSERT INTO producto (tipo_producto_id, marca, color, precio, stock, id_imagen) VALUES
-- Nike Products
(1, 'Nike Air Max 270', 'Blanco/Negro', 450000, 25, 1),
(1, 'Nike Air Force 1', 'Blanco', 380000, 30, 2),
(1, 'Nike React Element 55', 'Gris/Negro', 420000, 15, 3),
(2, 'Nike Air Zoom Pegasus 38', 'Azul/Blanco', 480000, 20, 4),
(2, 'Nike Revolution 6', 'Negro/Rojo', 280000, 35, 5),
(3, 'Nike LeBron 18', 'Negro/Dorado', 650000, 8, 6),

-- Adidas Products
(1, 'Adidas Ultraboost 22', 'Blanco/Negro', 520000, 18, 7),
(1, 'Adidas Stan Smith', 'Blanco/Verde', 320000, 40, 8),
(1, 'Adidas NMD R1', 'Negro/Blanco', 380000, 22, 9),
(2, 'Adidas Solarboost 4', 'Azul/Gris', 450000, 12, 10),
(2, 'Adidas Duramo 10', 'Negro', 250000, 28, 11),
(3, 'Adidas Harden Vol. 6', 'Rojo/Blanco', 580000, 6, 12),

-- Jordan Products
(1, 'Air Jordan 1 Retro High', 'Rojo/Blanco/Negro', 720000, 5, 13),
(1, 'Air Jordan 4 Retro', 'Blanco/Negro', 680000, 7, 14),
(1, 'Air Jordan 11 Retro', 'Blanco/Negro', 750000, 4, 15),
(3, 'Air Jordan 36', 'Negro/Rojo', 800000, 3, 16),

-- Puma Products
(1, 'Puma RS-X Reinvention', 'Blanco/Negro', 350000, 20, 17),
(1, 'Puma Suede Classic', 'Negro', 280000, 25, 18),
(2, 'Puma Velocity Nitro', 'Azul/Blanco', 420000, 15, 19),
(4, 'Puma Cali Sport', 'Blanco/Rosa', 320000, 18, 20),

-- Converse Products
(1, 'Converse Chuck Taylor All Star', 'Blanco', 180000, 50, 21),
(1, 'Converse Chuck 70', 'Negro', 220000, 30, 22),
(1, 'Converse One Star', 'Azul', 200000, 25, 23),
(4, 'Converse Jack Purcell', 'Blanco/Negro', 250000, 20, 24),

-- Vans Products
(1, 'Vans Old Skool', 'Negro/Blanco', 200000, 35, 25),
(1, 'Vans Sk8-Hi', 'Blanco/Negro', 220000, 28, 26),
(1, 'Vans Authentic', 'Rojo', 180000, 40, 27),
(4, 'Vans Slip-On', 'Negro', 190000, 32, 28),

-- New Balance Products
(1, 'New Balance 574', 'Gris/Blanco', 300000, 22, 29),
(1, 'New Balance 990v5', 'Gris', 450000, 12, 30),
(2, 'New Balance Fresh Foam 1080v12', 'Azul/Blanco', 480000, 15, 31),
(4, 'New Balance 327', 'Blanco/Negro', 280000, 18, 32),

-- Reebok Products
(1, 'Reebok Classic Leather', 'Blanco', 250000, 30, 33),
(1, 'Reebok Club C 85', 'Blanco/Negro', 220000, 25, 34),
(2, 'Reebok Floatride Energy 3', 'Negro/Blanco', 350000, 20, 35),
(4, 'Reebok Workout Plus', 'Blanco', 200000, 35, 36),

-- Productos de lujo
(5, 'Gucci Ace Sneaker', 'Blanco/Rojo/Verde', 1200000, 2, 37),
(5, 'Balenciaga Triple S', 'Blanco/Negro', 1500000, 1, 38),
(5, 'Off-White x Nike Blazer', 'Blanco/Negro', 1800000, 1, 39),
(5, 'Yeezy Boost 350 V2', 'Blanco/Cream', 800000, 3, 40),

-- Productos casuales
(4, 'Tommy Hilfiger Sneakers', 'Blanco/Azul', 380000, 15, 41),
(4, 'Lacoste Carnaby Evo', 'Blanco/Verde', 420000, 12, 42),
(4, 'Ralph Lauren Polo Sneakers', 'Blanco/Negro', 450000, 10, 43),
(4, 'Calvin Klein Sneakers', 'Negro/Blanco', 350000, 18, 44),

-- Productos deportivos especializados
(2, 'Asics Gel-Kayano 28', 'Azul/Blanco', 520000, 8, 45),
(2, 'Brooks Ghost 14', 'Negro/Blanco', 480000, 10, 46),
(2, 'Saucony Triumph 19', 'Gris/Blanco', 450000, 12, 47),
(3, 'Under Armour Curry 8', 'Amarillo/Negro', 600000, 6, 48),

-- Productos de temporada
(6, 'Nike Air Max 90', 'Blanco/Negro', 400000, 20, 49),
(6, 'Adidas Yeezy 700', 'Gris/Blanco', 900000, 2, 50),
(7, 'Timberland 6-Inch Boot', 'Amarillo', 650000, 8, 51),
(7, 'Dr. Martens 1460', 'Negro', 580000, 12, 52),
(8, 'Jimmy Choo Romy', 'Negro', 1200000, 3, 53),
(8, 'Christian Louboutin Pigalle', 'Rojo', 1500000, 1, 54);

-- Insertar más imágenes (URLs de ejemplo)
INSERT INTO imagen (url_imagen, descripcion) VALUES
('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Nike Air Max 270'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Nike Air Force 1'),
('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', 'Nike React Element'),
('https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500', 'Nike Air Zoom Pegasus'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Nike Revolution'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Nike LeBron'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Ultraboost'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Stan Smith'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas NMD'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Solarboost'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Duramo'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Harden'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Air Jordan 1'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Air Jordan 4'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Air Jordan 11'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Air Jordan 36'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Puma RS-X'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Puma Suede'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Puma Velocity'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Puma Cali'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Converse Chuck Taylor'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Converse Chuck 70'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Converse One Star'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Converse Jack Purcell'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Vans Old Skool'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Vans Sk8-Hi'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Vans Authentic'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Vans Slip-On'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'New Balance 574'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'New Balance 990'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'New Balance Fresh Foam'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'New Balance 327'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Reebok Classic'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Reebok Club C'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Reebok Floatride'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Reebok Workout'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Gucci Ace'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Balenciaga Triple S'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Off-White Blazer'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Yeezy Boost 350'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Tommy Hilfiger'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Lacoste Carnaby'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Ralph Lauren'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Calvin Klein'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Asics Gel-Kayano'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Brooks Ghost'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Saucony Triumph'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Under Armour Curry'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Nike Air Max 90'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Adidas Yeezy 700'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Timberland Boot'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Dr. Martens'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Jimmy Choo Romy'),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Christian Louboutin');

-- Insertar usuarios de ejemplo
INSERT INTO usuario (nombre, email, telefono, direccion, fecha_registro) VALUES
('María González', 'maria.gonzalez@email.com', '3001234567', 'Calle 123 #45-67, Bogotá', NOW()),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '3002345678', 'Carrera 45 #78-90, Medellín', NOW()),
('Ana Martínez', 'ana.martinez@email.com', '3003456789', 'Avenida 6 #12-34, Cali', NOW()),
('Luis Pérez', 'luis.perez@email.com', '3004567890', 'Calle 80 #23-45, Barranquilla', NOW()),
('Sofia Herrera', 'sofia.herrera@email.com', '3005678901', 'Carrera 15 #67-89, Bucaramanga', NOW()),
('Diego Silva', 'diego.silva@email.com', '3006789012', 'Avenida 68 #90-12, Pereira', NOW()),
('Valentina Cruz', 'valentina.cruz@email.com', '3007890123', 'Calle 100 #34-56, Cartagena', NOW()),
('Sebastián Morales', 'sebastian.morales@email.com', '3008901234', 'Carrera 30 #78-90, Manizales', NOW()),
('Isabella Rojas', 'isabella.rojas@email.com', '3009012345', 'Avenida 19 #45-67, Armenia', NOW()),
('Mateo Vargas', 'mateo.vargas@email.com', '3000123456', 'Calle 50 #12-34, Ibagué', NOW());

-- Insertar reviews de ejemplo
INSERT INTO review (id_producto, id_usuario, rating, comentario, fecha_creacion) VALUES
(1, 1, 5, 'Excelente calidad, muy cómodos y duraderos. Los recomiendo totalmente.', NOW()),
(1, 2, 4, 'Buenos zapatos, se ven exactamente como en la foto. Envío rápido.', NOW()),
(2, 3, 5, 'Perfectos para el día a día, muy cómodos y con buen estilo.', NOW()),
(2, 4, 3, 'Buenos pero un poco caros para lo que ofrecen.', NOW()),
(3, 5, 5, 'Increíbles, los uso para correr y son perfectos.', NOW()),
(3, 6, 4, 'Muy buenos, se adaptan bien al pie.', NOW()),
(4, 7, 5, 'Excelente amortiguación, ideales para correr largas distancias.', NOW()),
(4, 8, 4, 'Buenos zapatos deportivos, cómodos y ligeros.', NOW()),
(5, 9, 5, 'Perfectos para el gimnasio, muy resistentes.', NOW()),
(5, 10, 4, 'Buenos zapatos, se ven bien y son cómodos.', NOW());

-- Insertar items en carrito de ejemplo
INSERT INTO carrito (id_usuario, id_producto, cantidad, fecha_agregado) VALUES
(1, 1, 1, NOW()),
(1, 2, 2, NOW()),
(2, 3, 1, NOW()),
(3, 4, 1, NOW()),
(4, 5, 1, NOW()),
(5, 6, 1, NOW());

-- Insertar favoritos de ejemplo
INSERT INTO favoritos (id_usuario, id_producto, fecha_agregado) VALUES
(1, 3, NOW()),
(1, 5, NOW()),
(2, 1, NOW()),
(2, 4, NOW()),
(3, 2, NOW()),
(3, 6, NOW()),
(4, 1, NOW()),
(5, 3, NOW());

-- Insertar notificaciones de ejemplo
INSERT INTO notificacion (id_usuario, titulo, mensaje, tipo, leida, fecha_creacion) VALUES
(1, '¡Bienvenido a Tekashi Shoes!', 'Gracias por registrarte. Disfruta de envío gratis en tu primera compra.', 'info', 0, NOW()),
(2, 'Oferta especial', 'Descuento del 20% en tenis deportivos por tiempo limitado.', 'promocion', 0, NOW()),
(3, 'Producto disponible', 'El producto que estabas esperando ya está disponible.', 'stock', 0, NOW()),
(4, 'Envío confirmado', 'Tu pedido ha sido enviado y llegará en 2-3 días hábiles.', 'envio', 1, NOW()),
(5, 'Reseña solicitada', '¿Cómo fue tu experiencia con tu última compra?', 'review', 0, NOW());
