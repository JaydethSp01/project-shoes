import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfo,
} from "react-icons/fa";
import "../styles/GlobalAlert.css";

export interface Alert {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

interface GlobalAlertProps {
  alert: Alert | null;
  onClose: () => void;
}

const GlobalAlert: React.FC<GlobalAlertProps> = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);

      const duration = alert.duration || 5000;
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!alert) return null;

  const getIcon = () => {
    switch (alert.type) {
      case "success":
        return <FaCheck />;
      case "error":
        return <FaTimes />;
      case "warning":
        return <FaExclamationTriangle />;
      case "info":
        return <FaInfo />;
      default:
        return <FaInfo />;
    }
  };

  return (
    <div className={`global-alert ${alert.type} ${isVisible ? "visible" : ""}`}>
      <div className="alert-content">
        <div className="alert-icon">{getIcon()}</div>
        <div className="alert-text">
          <h4 className="alert-title">{alert.title}</h4>
          <p className="alert-message">{alert.message}</p>
        </div>
        <button className="alert-close" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default GlobalAlert;






