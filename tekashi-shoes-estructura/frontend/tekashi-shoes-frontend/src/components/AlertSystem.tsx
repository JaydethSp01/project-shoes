import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
  FaBell,
  FaGift,
  FaTruck,
  FaStar,
  FaFire,
} from "react-icons/fa";

interface Alert {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Alertas automáticas importantes
    const importantAlerts: Alert[] = [
      {
        id: "welcome-1",
        type: "info",
        title: "¡Bienvenido a Tekashi Shoes!",
        message:
          "Descubre nuestra colección premium de calzado deportivo y casual.",
        duration: 5000,
      },
      {
        id: "shipping-1",
        type: "success",
        title: "🚚 Envío Gratis",
        message:
          "En compras superiores a $200.000 el envío es completamente gratis.",
        duration: 6000,
      },
      {
        id: "new-collection-1",
        type: "info",
        title: "🔥 Nueva Colección 2025",
        message:
          "Descubre los últimos modelos de Nike, Adidas, Jordan y más marcas premium.",
        duration: 7000,
      },
    ];

    // Mostrar alertas con delay
    importantAlerts.forEach((alert, index) => {
      setTimeout(() => {
        addAlert(alert);
      }, index * 2000);
    });

    // Alertas de stock bajo
    const checkLowStock = () => {
      // Simular verificación de stock bajo
      const lowStockProducts = [
        { name: "Air Jordan 1", stock: 3 },
        { name: "Yeezy Boost 350", stock: 2 },
        { name: "Nike Air Force 1", stock: 5 },
      ];

      lowStockProducts.forEach((product) => {
        if (product.stock <= 5) {
          addAlert({
            id: `low-stock-${product.name}`,
            type: "warning",
            title: "⚠️ Stock Limitado",
            message: `Solo quedan ${product.stock} unidades de ${product.name}. ¡Aprovecha ahora!`,
            duration: 8000,
          });
        }
      });
    };

    // Verificar stock cada 30 segundos
    const stockInterval = setInterval(checkLowStock, 30000);

    return () => clearInterval(stockInterval);
  }, []);

  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [...prev, alert]);

    // Auto-remover si no es persistente
    if (!alert.persistent && alert.duration) {
      setTimeout(() => {
        removeAlert(alert.id);
      }, alert.duration);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle />;
      case "warning":
        return <FaExclamationTriangle />;
      case "error":
        return <FaTimes />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "warning":
        return "alert-warning";
      case "error":
        return "alert-error";
      default:
        return "alert-info";
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert ${getAlertClass(alert.type)}`}
          onClick={() => removeAlert(alert.id)}
        >
          <div className="alert-icon">{getAlertIcon(alert.type)}</div>
          <div className="alert-content">
            <h4 className="alert-title">{alert.title}</h4>
            <p className="alert-message">{alert.message}</p>
          </div>
          <button
            className="alert-close"
            onClick={(e) => {
              e.stopPropagation();
              removeAlert(alert.id);
            }}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;
