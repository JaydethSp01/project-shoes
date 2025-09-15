import React from "react";
import {
  FaCheck,
  FaExclamationTriangle,
  FaInfo,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import "../styles/BeautifulAlert.css";

export interface AlertProps {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const BeautifulAlert: React.FC<AlertProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheck className="alert-icon success" />;
      case "error":
        return <FaTimes className="alert-icon error" />;
      case "warning":
        return <FaExclamationTriangle className="alert-icon warning" />;
      case "info":
        return <FaInfo className="alert-icon info" />;
      case "confirm":
        return <FaTrash className="alert-icon confirm" />;
      default:
        return <FaInfo className="alert-icon info" />;
    }
  };

  return (
    <div className="beautiful-alert-overlay">
      <div className={`beautiful-alert ${type}`}>
        <button className="alert-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="alert-content">
          {getIcon()}
          <h3 className="alert-title">{title}</h3>
          <p className="alert-message">{message}</p>

          <div className="alert-actions">
            {type === "confirm" ? (
              <>
                <button className="btn-alert btn-cancel" onClick={onClose}>
                  {cancelText}
                </button>
                <button
                  className="btn-alert btn-confirm"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button className="btn-alert btn-primary" onClick={onClose}>
                Entendido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautifulAlert;

