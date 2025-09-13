-- Datos simples para la tienda
-- Insertar más tipos de producto
INSERT INTO tipo_producto (nombre) VALUES
('Sneakers'),
('Running'),
('Basketball'),
('Casual'),
('Formal');

-- Insertar más productos sin imágenes por ahora
INSERT INTO producto (tipo_producto_id, marca, color, precio, stock) VALUES
-- Nike Products
(1, 'Nike Air Max 270', 'Blanco/Negro', 450000, 25),
(1, 'Nike Air Force 1', 'Blanco', 380000, 30),
(1, 'Nike React Element 55', 'Gris/Negro', 420000, 15),
(2, 'Nike Air Zoom Pegasus 38', 'Azul/Blanco', 480000, 20),
(2, 'Nike Revolution 6', 'Negro/Rojo', 280000, 35),
(3, 'Nike LeBron 18', 'Negro/Dorado', 650000, 8),

-- Adidas Products
(1, 'Adidas Ultraboost 22', 'Blanco/Negro', 520000, 18),
(1, 'Adidas Stan Smith', 'Blanco/Verde', 320000, 40),
(1, 'Adidas NMD R1', 'Negro/Blanco', 380000, 22),
(2, 'Adidas Solarboost 4', 'Azul/Gris', 450000, 12),
(2, 'Adidas Duramo 10', 'Negro', 250000, 28),
(3, 'Adidas Harden Vol. 6', 'Rojo/Blanco', 580000, 6),

-- Jordan Products
(1, 'Air Jordan 1 Retro High', 'Rojo/Blanco/Negro', 720000, 5),
(1, 'Air Jordan 4 Retro', 'Blanco/Negro', 680000, 7),
(1, 'Air Jordan 11 Retro', 'Blanco/Negro', 750000, 4),
(3, 'Air Jordan 36', 'Negro/Rojo', 800000, 3),

-- Puma Products
(1, 'Puma RS-X Reinvention', 'Blanco/Negro', 350000, 20),
(1, 'Puma Suede Classic', 'Negro', 280000, 25),
(2, 'Puma Velocity Nitro', 'Azul/Blanco', 420000, 15),
(4, 'Puma Cali Sport', 'Blanco/Rosa', 320000, 18),

-- Converse Products
(1, 'Converse Chuck Taylor All Star', 'Blanco', 180000, 50),
(1, 'Converse Chuck 70', 'Negro', 220000, 30),
(1, 'Converse One Star', 'Azul', 200000, 25),
(4, 'Converse Jack Purcell', 'Blanco/Negro', 250000, 20),

-- Vans Products
(1, 'Vans Old Skool', 'Negro/Blanco', 200000, 35),
(1, 'Vans Sk8-Hi', 'Blanco/Negro', 220000, 28),
(1, 'Vans Authentic', 'Rojo', 180000, 40),
(4, 'Vans Slip-On', 'Negro', 190000, 32),

-- New Balance Products
(1, 'New Balance 574', 'Gris/Blanco', 300000, 22),
(1, 'New Balance 990v5', 'Gris', 450000, 12),
(2, 'New Balance Fresh Foam 1080v12', 'Azul/Blanco', 480000, 15),
(4, 'New Balance 327', 'Blanco/Negro', 280000, 18),

-- Reebok Products
(1, 'Reebok Classic Leather', 'Blanco', 250000, 30),
(1, 'Reebok Club C 85', 'Blanco/Negro', 220000, 25),
(2, 'Reebok Floatride Energy 3', 'Negro/Blanco', 350000, 20),
(4, 'Reebok Workout Plus', 'Blanco', 200000, 35),

-- Productos de lujo
(5, 'Gucci Ace Sneaker', 'Blanco/Rojo/Verde', 1200000, 2),
(5, 'Balenciaga Triple S', 'Blanco/Negro', 1500000, 1),
(5, 'Off-White x Nike Blazer', 'Blanco/Negro', 1800000, 1),
(5, 'Yeezy Boost 350 V2', 'Blanco/Cream', 800000, 3),

-- Productos casuales
(4, 'Tommy Hilfiger Sneakers', 'Blanco/Azul', 380000, 15),
(4, 'Lacoste Carnaby Evo', 'Blanco/Verde', 420000, 12),
(4, 'Ralph Lauren Polo Sneakers', 'Blanco/Negro', 450000, 10),
(4, 'Calvin Klein Sneakers', 'Negro/Blanco', 350000, 18),

-- Productos deportivos especializados
(2, 'Asics Gel-Kayano 28', 'Azul/Blanco', 520000, 8),
(2, 'Brooks Ghost 14', 'Negro/Blanco', 480000, 10),
(2, 'Saucony Triumph 19', 'Gris/Blanco', 450000, 12),
(3, 'Under Armour Curry 8', 'Amarillo/Negro', 600000, 6);

