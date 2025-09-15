import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaGift,
  FaTruck,
  FaStar,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import {
  notificationService,
  Notification,
} from "../services/NotificationService";
import "../styles/NotificationSystem.css";

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Suscribirse al servicio de notificaciones
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Cargar notificaciones iniciales
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (id: string) => {
    notificationService.removeNotification(id);
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-success" />;
      case "warning":
        return <FaExclamationTriangle className="text-warning" />;
      case "error":
        return <FaTimesCircle className="text-danger" />;
      case "promocion":
        return <FaGift className="text-warning" />;
      case "stock":
        return <FaExclamationTriangle className="text-warning" />;
      case "envio":
        return <FaTruck className="text-info" />;
      case "review":
        return <FaStar className="text-warning" />;
      default:
        return <FaInfoCircle className="text-info" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  return (
    <>
      {/* Botón de notificaciones */}
      <button
        className="notification-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Ver notificaciones"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="notification-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="notification-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notification-header">
              <h5>
                <FaBell className="me-2" />
                Notificaciones del Sistema
                {unreadCount > 0 && (
                  <span className="unread-count">({unreadCount})</span>
                )}
              </h5>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={markAllAsRead}
                  >
                    <FaCheck className="me-1" />
                    Marcar como leídas
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={clearAllNotifications}
                  >
                    <FaTrash className="me-1" />
                    Borrar todas
                  </button>
                )}
                <button
                  className="notification-close-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="notification-content">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <FaBell className="no-notifications-icon" />
                  <p>No hay notificaciones</p>
                  <small>Te notificaremos cuando haya novedades</small>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                    >
                      <div className="notification-icon">
                        {getIcon(notification.type)}
                      </div>

                      <div className="notification-body">
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>

                      <div className="notification-actions-item">
                        {!notification.read && (
                          <button
                            className="mark-read-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Marcar como leída"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          title="Eliminar notificación"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
