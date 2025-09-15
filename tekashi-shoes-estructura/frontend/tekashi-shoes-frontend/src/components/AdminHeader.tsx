import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { notificationService } from "../services/NotificationService";
import "../styles/AdminHeader.css";

const AdminHeader: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Suscribirse a cambios de notificaciones
    const unsubscribeNotifications = notificationService.subscribe(
      (notifications) => {
        setNotifications(notifications);
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        setNotificationCount(unreadCount);
      }
    );

    // Cargar notificaciones iniciales
    loadNotifications();

    return () => {
      unsubscribeNotifications();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      // Cargar notificaciones del sistema para admin
      const adminNotifications = await loadAdminNotifications();
      setNotifications(adminNotifications);
      const unreadCount = adminNotifications.filter(
        (n: { isRead: boolean }) => !n.isRead
      ).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error loading admin notifications:", error);
    }
  };

  const loadAdminNotifications = async () => {
    try {
      // Cargar notificaciones reales desde el backend
      const response = await fetch("http://localhost:8080/admin/notifications");
      if (!response.ok) {
        throw new Error("Error al cargar notificaciones");
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data.map(
          (notification: {
            id_activity: number;
            notification_title: string;
            activity_description: string;
            activity_type: string;
            is_read: boolean;
            created_at: string;
            metadata?: string;
            user_name?: string;
            user_email?: string;
          }) => ({
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
      return [];
    }
  };

  type AdminNotification = {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, unknown>;
    user_name?: string;
    user_email?: string;
  };

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.isRead) {
      try {
        // Marcar como leída en el backend
        await fetch("http://localhost:8080/admin/mark-notification-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityId: notification.id,
          }),
        });

        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
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
      // Marcar todas como leídas en el backend
      await fetch("http://localhost:8080/admin/mark-all-notifications-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛒";
      case "stock":
        return "📦";
      case "user":
        return "👤";
      case "payment":
        return "💳";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <div className="admin-header">
      <div className="admin-header-actions">
        {/* Notificaciones del Sistema */}
        <div className="notification-container">
          <button
            className="notification-btn admin-notification-btn"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Toggle notifications:", !showNotifications);
              setShowNotifications(!showNotifications);
            }}
            title="Notificaciones del Sistema"
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
                        {notification.data && (
                          <div className="notification-data">
                            {notification.type === "order" && (
                              <span className="data-item">
                                Orden: {notification.data.orderId}
                              </span>
                            )}
                            {notification.type === "stock" && (
                              <span className="data-item">
                                Stock: {notification.data.stock || "Agotado"}
                              </span>
                            )}
                            {notification.type === "user" && (
                              <span className="data-item">
                                Usuario: {notification.data.userName}
                              </span>
                            )}
                            {notification.type === "payment" && (
                              <span className="data-item">
                                Pago: {notification.data.paymentId}
                              </span>
                            )}
                          </div>
                        )}
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
      </div>

      {/* Overlay para cerrar notificaciones al hacer click fuera */}
      {showNotifications && (
        <div
          className="notifications-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default AdminHeader;
