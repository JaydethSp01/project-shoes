import React, { useState, useEffect } from "react";
import { FaCheck, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import "../styles/InlineNotification.css";

interface InlineNotificationProps {
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
  onClose?: () => void;
}

const InlineNotification: React.FC<InlineNotificationProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Esperar a que termine la animación
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheck />;
      case "error":
        return <FaExclamationTriangle />;
      case "info":
        return <FaExclamationTriangle />;
      default:
        return <FaCheck />;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`inline-notification ${type} ${isVisible ? "show" : "hide"}`}
    >
      <div className="notification-content">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default InlineNotification;
