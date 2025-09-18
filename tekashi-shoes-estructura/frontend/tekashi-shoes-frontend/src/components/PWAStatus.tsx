import React from "react";
import { usePWA } from "../hooks/usePWA";

const PWAStatus: React.FC = () => {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isUpdateAvailable,
    installApp,
    updateApp,
  } = usePWA();

  if (!isOnline) {
    return (
      <div className="pwa-status offline">
        <div className="status-indicator">
          <span className="status-icon">📡</span>
          <span className="status-text">Sin conexión</span>
        </div>
        <div className="status-message">
          Algunas funciones pueden estar limitadas
        </div>
      </div>
    );
  }

  if (isUpdateAvailable) {
    return (
      <div className="pwa-status update-available">
        <div className="status-indicator">
          <span className="status-icon">🔄</span>
          <span className="status-text">Actualización disponible</span>
        </div>
        <button className="update-button" onClick={updateApp}>
          Actualizar ahora
        </button>
      </div>
    );
  }

  if (isInstallable && !isInstalled) {
    return (
      <div className="pwa-status installable">
        <div className="status-indicator">
          <span className="status-icon">📱</span>
          <span className="status-text">Instalar app</span>
        </div>
        <button className="install-button" onClick={installApp}>
          Instalar
        </button>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="pwa-status installed">
        <div className="status-indicator">
          <span className="status-icon">✅</span>
          <span className="status-text">App instalada</span>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAStatus;
