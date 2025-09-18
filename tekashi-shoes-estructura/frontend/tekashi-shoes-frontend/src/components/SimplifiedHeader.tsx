import React, { useState, useEffect, useCallback } from "react";
import { FaBell, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { cartService } from "../services/CartService";
import {
  notificationService,
  Notification as ServiceNotification,
} from "../services/NotificationService";
import { authService } from "../services/AuthService";
import LanguageSelector from "./LanguageSelector";
import "../styles/SimplifiedHeader.css";

// Usar la interfaz del servicio

// interface CartItem {
//   id: number;
//   quantity: number;
//   [key: string]: unknown;
// }

interface SimplifiedHeaderProps {
  onCartOpen: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ onCartOpen }) => {
  const { t } = useTranslation();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);
  const [currentUser] = useState(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const userNotifications = await notificationService.getNotifications();
      setNotifications(userNotifications as ServiceNotification[]);
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
      unsubscribeCart = cartService.subscribe(
        (cart: { quantity: number }[]) => {
          const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        }
      );
    }

    if (
      notificationService &&
      typeof notificationService.subscribe === "function"
    ) {
      unsubscribeNotifications = notificationService.subscribe(
        (notifications: ServiceNotification[]) => {
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

  const handleNotificationClick = async (notification: ServiceNotification) => {
    if (!notification.read) {
      try {
        await notificationService.markAsRead(notification.id.toString());
        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
        setNotificationCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);

      // Marcar todas como leídas
      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationService.markAsRead(notification.id.toString())
        )
      );

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
          {/* Selector de idioma */}
          <LanguageSelector />

          {/* Notificaciones */}
          <div className="notification-container">
            <button
              className="notification-btn"
              onClick={handleToggleNotifications}
              title={t("additional.notifications")}
              aria-label={t("additional.notificationsUnread", {
                count: notificationCount,
              })}
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
                  <h3>{t("additional.notifications")}</h3>
                  <div className="notifications-actions">
                    {notificationCount > 0 && (
                      <button
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                        disabled={isLoading}
                      >
                        {t("additional.markAllAsRead")}
                      </button>
                    )}
                    <button
                      className="close-notifications-btn"
                      onClick={handleCloseNotifications}
                      aria-label={t("additional.closeNotifications")}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="notifications-list">
                  {isLoading ? (
                    <div className="loading-notifications">
                      <p>{t("additional.loadingNotifications")}</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="no-notifications">
                      <p>{t("additional.noNotifications")}</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read ? "unread" : ""
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
                            {formatDate(notification.timestamp.toString())}
                          </span>
                        </div>
                        {!notification.read && (
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
            title={t("additional.shoppingCart")}
            aria-label={t("additional.shoppingCartItems", {
              count: cartItemCount,
            })}
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

