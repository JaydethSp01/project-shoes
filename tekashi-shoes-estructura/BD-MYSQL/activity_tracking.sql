-- Tabla para tracking de actividades del sistema (notificaciones para admin)
CREATE TABLE IF NOT EXISTS activity_tracking (
    id_activity INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type ENUM('login', 'logout', 'register', 'purchase', 'add_to_cart', 'add_to_favorites', 'review', 'search', 'admin_action') NOT NULL,
    activity_description TEXT NOT NULL,
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);

-- Insertar datos de ejemplo para testing
INSERT INTO activity_tracking (user_id, activity_type, activity_description, metadata, ip_address) VALUES
(1, 'login', 'Usuario inició sesión', '{"user_name": "admin", "role": "admin"}', '127.0.0.1'),
(2, 'register', 'Nuevo usuario registrado', '{"user_name": "Juan Pérez", "email": "juan@email.com"}', '127.0.0.1'),
(3, 'purchase', 'Usuario realizó una compra', '{"order_id": "TK001", "amount": 350000, "products": ["Nike Air Max", "Adidas Ultraboost"]}', '127.0.0.1'),
(4, 'add_to_cart', 'Producto agregado al carrito', '{"product_id": 123, "product_name": "Nike Air Max 270", "price": 280000}', '127.0.0.1'),
(5, 'review', 'Usuario dejó una reseña', '{"product_id": 456, "rating": 5, "review_text": "Excelente producto"}', '127.0.0.1'),
(6, 'search', 'Usuario realizó búsqueda', '{"search_term": "nike air", "results_count": 15}', '127.0.0.1'),
(1, 'admin_action', 'Admin modificó producto', '{"product_id": 789, "action": "update", "changes": {"price": 300000}}', '127.0.0.1'),
(2, 'logout', 'Usuario cerró sesión', '{"session_duration": "2h 30m"}', '127.0.0.1'),
(3, 'add_to_favorites', 'Producto agregado a favoritos', '{"product_id": 321, "product_name": "Adidas Ultraboost 22"}', '127.0.0.1'),
(4, 'purchase', 'Compra completada', '{"order_id": "TK002", "amount": 450000, "payment_method": "credit_card"}', '127.0.0.1');

-- Vista para notificaciones del admin
CREATE OR REPLACE VIEW admin_notifications AS
SELECT 
    at.id_activity,
    at.user_id,
    at.activity_type,
    at.activity_description,
    at.metadata,
    at.created_at,
    at.is_read,
    u.nombre as user_name,
    u.email as user_email,
    CASE 
        WHEN at.activity_type = 'login' THEN '👤 Usuario inició sesión'
        WHEN at.activity_type = 'register' THEN '🆕 Nuevo usuario registrado'
        WHEN at.activity_type = 'purchase' THEN '🛒 Usuario realizó compra'
        WHEN at.activity_type = 'add_to_cart' THEN '🛍️ Producto agregado al carrito'
        WHEN at.activity_type = 'review' THEN '⭐ Usuario dejó reseña'
        WHEN at.activity_type = 'search' THEN '🔍 Usuario realizó búsqueda'
        WHEN at.activity_type = 'logout' THEN '👋 Usuario cerró sesión'
        WHEN at.activity_type = 'add_to_favorites' THEN '❤️ Producto agregado a favoritos'
        WHEN at.activity_type = 'admin_action' THEN '⚙️ Acción administrativa'
        ELSE '📋 Actividad del sistema'
    END as notification_title,
    CASE 
        WHEN at.activity_type = 'purchase' THEN 'success'
        WHEN at.activity_type = 'register' THEN 'info'
        WHEN at.activity_type = 'admin_action' THEN 'warning'
        WHEN at.activity_type = 'logout' THEN 'secondary'
        ELSE 'primary'
    END as notification_type
FROM activity_tracking at
LEFT JOIN usuario u ON at.user_id = u.id_usuario
ORDER BY at.created_at DESC;

