import React, { useState, useEffect, useCallback } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { notificationService } from "../services/NotificationService";
import "../styles/AdminHeader.css";

// Definir interfaces al inicio del archivo
interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
  user_name?: string;
  user_email?: string;
}

interface BackendNotification {
  id_activity: number;
  notification_title: string;
  activity_description: string;
  activity_type: string;
  is_read: boolean;
  created_at: string;
  metadata?: string;
  user_name?: string;
  user_email?: string;
}

interface ApiResponse {
  success: boolean;
  data?: BackendNotification[];
  message?: string;
}

const AdminHeader: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Función para cargar notificaciones desde el backend
  const loadAdminNotifications = useCallback(async (): Promise<
    AdminNotification[]
  > => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8080/admin/notifications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Agregar headers de autenticación si es necesario
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        return result.data.map(
          (notification: BackendNotification): AdminNotification => ({
            id: notification.id_activity,
            title: notification.notification_title,
            message: notification.activity_description,
            type: notification.activity_type,
            isRead: notification.is_read,
            createdAt: notification.created_at,
            data: notification.metadata
              ? JSON.parse(notification.metadata)
              : {},
            user_name: notification.user_name,
            user_email: notification.user_email,
          })
        );
      }

      return [];
    } catch (error) {
      console.error("Error loading admin notifications:", error);
      // Aquí podrías mostrar una notificación de error al usuario
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función principal para cargar notificaciones
  const loadNotifications = useCallback(async () => {
    try {
      const adminNotifications = await loadAdminNotifications();
      setNotifications(adminNotifications);
      const unreadCount = adminNotifications.filter((n) => !n.isRead).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [loadAdminNotifications]);

  useEffect(() => {
    let unsubscribeNotifications: (() => void) | undefined;

    // Verificar si notificationService existe y tiene el método subscribe
    if (
      notificationService &&
      typeof notificationService.subscribe === "function"
    ) {
      unsubscribeNotifications = notificationService.subscribe(
        (notifications: any[]) => {
          setNotifications(notifications);
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          setNotificationCount(unreadCount);
        }
      );
    }

    // Cargar notificaciones iniciales
    loadNotifications();

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [loadNotifications]);

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.isRead) {
      try {
        const response = await fetch(
          "http://localhost:8080/admin/mark-notification-read",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Agregar headers de autenticación si es necesario
            },
            body: JSON.stringify({
              activityId: notification.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Actualizar estado local solo si la operación fue exitosa
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          setNotificationCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Aquí podrías mostrar una notificación de error al usuario
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/admin/mark-all-notifications-read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Agregar headers de autenticación si es necesario
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar estado local solo si la operación fue exitosa
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setNotificationCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Aquí podrías mostrar una notificación de error al usuario
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
      return dateString; // Retornar la fecha original si hay error
    }
  };

  const getNotificationIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      order: "🛒",
      stock: "📦",
      user: "👤",
      payment: "💳",
      system: "⚙️",
    };

    return iconMap[type] || "🔔";
  };

  const handleToggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Toggle notifications:", !showNotifications);
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const renderNotificationData = (notification: AdminNotification) => {
    if (!notification.data) return null;

    const dataItems: JSX.Element[] = [];

    if (notification.type === "order" && notification.data.orderId) {
      dataItems.push(
        <span key="order" className="data-item">
          Orden: {String(notification.data?.orderId || "N/A")}
        </span>
      );
    }

    if (notification.type === "stock") {
      dataItems.push(
        <span key="stock" className="data-item">
          Stock: {String(notification.data?.stock || "Agotado")}
        </span>
      );
    }

    if (notification.type === "user" && notification.data.userName) {
      dataItems.push(
        <span key="user" className="data-item">
          Usuario: {String(notification.data?.userName || "N/A")}
        </span>
      );
    }

    if (notification.type === "payment" && notification.data.paymentId) {
      dataItems.push(
        <span key="payment" className="data-item">
          Pago: {String(notification.data?.paymentId || "N/A")}
        </span>
      );
    }

    return dataItems.length > 0 ? (
      <div className="notification-data">{dataItems}</div>
    ) : null;
  };

  return (
    <div className="admin-header">
      <div className="admin-header-actions">
        {/* Notificaciones del Sistema */}
        <div className="notification-container">
          <button
            className="notification-btn admin-notification-btn"
            onClick={handleToggleNotifications}
            title="Notificaciones del Sistema"
            aria-label={`Notificaciones del Sistema (${notificationCount} sin leer)`}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>

          {/* Panel de Notificaciones del Sistema */}
          {showNotifications && (
            <div
              className="notifications-panel admin-notifications-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notifications-header">
                <h3>🔔 Notificaciones del Sistema</h3>
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
                    <p>No hay notificaciones del sistema</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item admin-notification-item ${
                        !notification.isRead ? "unread" : ""
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
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-date">
                          {formatDate(notification.createdAt)}
                        </span>
                        {renderNotificationData(notification)}
                      </div>
                      {!notification.isRead && (
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
      </div>

      {/* Overlay para cerrar notificaciones al hacer click fuera */}
      {showNotifications && (
        <div
          className="notifications-overlay"
          onClick={handleCloseNotifications}
        />
      )}
    </div>
  );
};

export default AdminHeader;
