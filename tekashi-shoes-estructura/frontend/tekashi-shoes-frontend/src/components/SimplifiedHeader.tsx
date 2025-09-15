import React, { useState, useEffect } from "react";
import { FaBell, FaShoppingCart, FaTimes } from "react-icons/fa";
import { cartService } from "../services/CartService";
import { notificationService } from "../services/NotificationService";
import { authService } from "../services/AuthService";
import "../styles/SimplifiedHeader.css";

interface SimplifiedHeaderProps {
  onCartOpen: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ onCartOpen }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    // Suscribirse a cambios del carrito
    const unsubscribeCart = cartService.subscribe((cart) => {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    });

    // Suscribirse a cambios de notificaciones
    const unsubscribeNotifications = notificationService.subscribe((notifications) => {
      setNotifications(notifications);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setNotificationCount(unreadCount);
    });

    // Cargar notificaciones iniciales
    loadNotifications();

    return () => {
      unsubscribeCart();
      unsubscribeNotifications();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const userNotifications = await notificationService.getNotifications();
      setNotifications(userNotifications);
      const unreadCount = userNotifications.filter(n => !n.isRead).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      notificationService.markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        notificationService.markAsRead(notification.id);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Solo mostrar para usuarios logueados (no admins)
  if (!currentUser || authService.isAdmin()) {
    return null;
  }

  return (
    <>
      <div className="simplified-header">
        <div className="header-actions">
          {/* Notificaciones */}


            {/* Panel de Notificaciones */}
            {showNotifications && (
              <div className="notifications-panel">
                <div className="notifications-header">
                  <h3>Notificaciones</h3>
                  <div className="notifications-actions">
                    {notificationCount > 0 && (
                      <button
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                    <button
                      className="close-notifications-btn"
                      onClick={() => setShowNotifications(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <p>No tienes notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-date">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <div className="unread-indicator"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Carrito de Compras */}
          <button
            className="cart-btn"
            onClick={onCartOpen}
            title="Carrito de Compras"
          >
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Overlay para cerrar notificaciones al hacer click fuera */}
      {showNotifications && (
        <div
          className="notifications-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default SimplifiedHeader;

