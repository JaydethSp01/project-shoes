import React from "react";
import ModernAlert, { AlertType } from "./ModernAlert";
import { AlertState } from "../hooks/useModernAlert";

interface AlertContainerProps {
  alerts: AlertState[];
  onClose: (id: string) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, onClose }) => {
  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <ModernAlert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isOpen={alert.isOpen}
          onClose={() => onClose(alert.id)}
          duration={alert.duration}
          showCloseButton={alert.showCloseButton}
          actions={alert.actions}
          details={alert.details}
          showCopyButton={alert.showCopyButton}
          showRetryButton={alert.showRetryButton}
          onRetry={alert.onRetry}
        />
      ))}
    </div>
  );
};

export default AlertContainer;
