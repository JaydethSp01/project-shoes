import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
  FaCopy,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "../styles/ModernAlert.css";

export type AlertType = "success" | "error" | "warning" | "info";

export interface ModernAlertProps {
  type: AlertType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  showCloseButton?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  details?: string;
  showCopyButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

const ModernAlert: React.FC<ModernAlertProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  duration = 5000,
  showCloseButton = true,
  actions = [],
  details,
  showCopyButton = false,
  showRetryButton = false,
  onRetry,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsExpanded(false);

      // Auto-close after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCopy = async () => {
    const textToCopy = `${title}\n${message}${
      details ? `\n\nDetalles:\n${details}` : ""
    }`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="alert-icon success" />;
      case "error":
        return <FaTimesCircle className="alert-icon error" />;
      case "warning":
        return <FaExclamationTriangle className="alert-icon warning" />;
      case "info":
        return <FaInfoCircle className="alert-icon info" />;
      default:
        return <FaInfoCircle className="alert-icon info" />;
    }
  };

  const getTypeClass = () => {
    return `modern-alert ${type} ${isVisible ? "visible" : ""}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modern-alert-overlay">
      <div className={getTypeClass()}>
        {/* Header */}
        <div className="alert-header">
          <div className="alert-icon-container">{getIcon()}</div>
          <div className="alert-content">
            <h3 className="alert-title">{title}</h3>
            <p className="alert-message">{message}</p>
          </div>
          {showCloseButton && (
            <button className="alert-close-btn" onClick={handleClose}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* Details Section */}
        {details && (
          <div className="alert-details">
            <button
              className="details-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>Detalles técnicos</span>
              <span className={`toggle-icon ${isExpanded ? "expanded" : ""}`}>
                ▼
              </span>
            </button>
            {isExpanded && (
              <div className="details-content">
                <pre className="details-text">{details}</pre>
                {showCopyButton && (
                  <button
                    className="copy-details-btn"
                    onClick={handleCopy}
                    title="Copiar detalles"
                  >
                    <FaCopy />
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {(actions.length > 0 || showRetryButton) && (
          <div className="alert-actions">
            {showRetryButton && onRetry && (
              <button className="action-btn retry" onClick={onRetry}>
                Reintentar
              </button>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                className={`action-btn ${action.variant || "secondary"}`}
                onClick={action.action}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="alert-progress">
            <div className="progress-bar" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAlert;
