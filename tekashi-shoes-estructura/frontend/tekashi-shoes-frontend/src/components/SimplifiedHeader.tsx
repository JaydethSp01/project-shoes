import React, { useState, useEffect, useCallback } from "react";
import { FaBell, FaShoppingCart, FaTimes } from "react-icons/fa";
import { cartService } from "../services/CartService";
import { notificationService } from "../services/NotificationService";
import { authService } from "../services/AuthService";
import "../styles/SimplifiedHeader.css";

// Definir interfaces
interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  read: boolean; // Para compatibilidad con diferentes propiedades
  createdAt: string;
  type?: string;
  data?: Record<string, unknown>;
}

// interface CartItem {
//   id: number;
//   quantity: number;
//   [key: string]: unknown;
// }

interface SimplifiedHeaderProps {
  onCartOpen: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ onCartOpen }) => {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser] = useState(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const userNotifications = await notificationService.getNotifications();
      setNotifications(userNotifications as any);
      // Usar tanto 'read' como 'isRead' para compatibilidad
      const unreadCount = userNotifications.filter((n) => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribeCart: (() => void) | undefined;
    let unsubscribeNotifications: (() => void) | undefined;

    // Verificar si los servicios existen antes de suscribirse
    if (cartService && typeof cartService.subscribe === "function") {
      unsubscribeCart = cartService.subscribe((cart: any[]) => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalItems);
      });
    }

    if (
      notificationService &&
      typeof notificationService.subscribe === "function"
    ) {
      unsubscribeNotifications = notificationService.subscribe(
        (notifications: any[]) => {
          setNotifications(notifications);
          // Usar tanto 'read' como 'isRead' para compatibilidad
          const unreadCount = notifications.filter((n) => !n.read).length;
          setNotificationCount(unreadCount);
        }
      );
    }

    // Cargar notificaciones iniciales
    loadNotifications();

    return () => {
      if (unsubscribeCart) {
        unsubscribeCart();
      }
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [loadNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead && !notification.read) {
      try {
        await notificationService.markAsRead(notification.id.toString());
        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true, read: true } : n
          )
        );
        setNotificationCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (n) => !n.isRead && !n.read
      );

      // Marcar todas como leídas
      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationService.markAsRead(notification.id.toString())
        )
      );

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleToggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
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
          <div className="notification-container">
            <button
              className="notification-btn"
              onClick={handleToggleNotifications}
              title="Notificaciones"
              aria-label={`Notificaciones (${notificationCount} sin leer)`}
            >
              <FaBell />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {/* Panel de Notificaciones */}
            {showNotifications && (
              <div
                className="notifications-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="notifications-header">
                  <h3>Notificaciones</h3>
                  <div className="notifications-actions">
                    {notificationCount > 0 && (
                      <button
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                        disabled={isLoading}
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                    <button
                      className="close-notifications-btn"
                      onClick={handleCloseNotifications}
                      aria-label="Cerrar notificaciones"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="notifications-list">
                  {isLoading ? (
                    <div className="loading-notifications">
                      <p>Cargando notificaciones...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="no-notifications">
                      <p>No tienes notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.isRead && !notification.read
                            ? "unread"
                            : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleNotificationClick(notification);
                          }
                        }}
                      >
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-date">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.isRead && !notification.read && (
                          <div
                            className="unread-indicator"
                            aria-hidden="true"
                          ></div>
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
            aria-label={`Carrito de Compras (${cartItemCount} productos)`}
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
          onClick={handleCloseNotifications}
        />
      )}
    </>
  );
};

export default SimplifiedHeader;

