import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaDownload,
  FaCopy,
  FaTimes,
  FaTruck,
  FaCreditCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaReceipt,
  FaShare,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/TransactionSuccessModal.css";

interface OrderData {
  _id: string;
  numeroPedido: string;
  detalles: Array<{
    productoId: {
      _id: string;
      nombre: string;
      precio: number;
      marca: string;
    };
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  direccionEnvio: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
  };
  informacionPago: {
    metodo: string;
  };
  subtotal: number;
  impuestos: number;
  costoEnvio: number;
  descuento: number;
  total: number;
  estado: string;
  fechaPedido: string;
  puntosFidelidadGanados: number;
}

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null;
  onDownloadReceipt?: () => void;
}

const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onDownloadReceipt,
}) => {
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleCopyOrderNumber = async () => {
    if (orderData?.numeroPedido) {
      try {
        await navigator.clipboard.writeText(orderData.numeroPedido);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && orderData) {
      try {
        await navigator.share({
          title: "Pedido Confirmado - Tekashi Shoes",
          text: `Mi pedido #${
            orderData.numeroPedido
          } ha sido confirmado exitosamente. Total: $${orderData.total.toLocaleString()}`,
          url: window.location.origin,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Tarjeta de Crédito/Débito";
      case "debit_card":
        return "Tarjeta de Débito";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Transferencia Bancaria";
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen || !orderData) {
    console.log("❌ Modal no se muestra:", { isOpen, orderData: !!orderData });
    return null;
  }
  
  console.log("✅ Modal se está renderizando:", { isOpen, orderData });

  return (
    <div className="transaction-success-overlay">
      <div className="transaction-success-modal">
        {/* Header con animación de éxito */}
        <div className="success-header">
          <div className={`success-icon ${showAnimation ? "animate" : ""}`}>
            <FaCheckCircle />
          </div>
          <h2 className="success-title">¡Transacción Exitosa!</h2>
          <p className="success-subtitle">
            Tu pedido ha sido procesado correctamente
          </p>
        </div>

        {/* Información del pedido */}
        <div className="order-info-section">
          <div className="order-number-card">
            <div className="order-number-header">
              <FaReceipt className="order-icon" />
              <h3>Número de Pedido</h3>
            </div>
            <div className="order-number-content">
              <span className="order-number">{orderData.numeroPedido}</span>
              <button
                className="copy-btn"
                onClick={handleCopyOrderNumber}
                title="Copiar número de pedido"
              >
                <FaCopy />
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="order-summary-card">
            <h3>Resumen del Pedido</h3>
            <div className="summary-items">
              {orderData.detalles.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.productoId.nombre}</span>
                    <span className="item-brand">{item.productoId.marca}</span>
                    <span className="item-quantity">
                      Cantidad: {item.cantidad}
                    </span>
                  </div>
                  <span className="item-price">
                    ${item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="total-line">
                <span>Envío:</span>
                <span>
                  {orderData.costoEnvio === 0
                    ? "Gratis"
                    : `$${orderData.costoEnvio.toLocaleString()}`}
                </span>
              </div>
              <div className="total-line">
                <span>IVA (19%):</span>
                <span>${orderData.impuestos.toLocaleString()}</span>
              </div>
              {orderData.descuento > 0 && (
                <div className="total-line discount">
                  <span>Descuento:</span>
                  <span>-${orderData.descuento.toLocaleString()}</span>
                </div>
              )}
              <div className="total-line final-total">
                <span>Total:</span>
                <span>${orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Información de envío */}
          <div className="shipping-info-card">
            <div className="shipping-header">
              <FaTruck className="shipping-icon" />
              <h3>Información de Envío</h3>
            </div>
            <div className="shipping-details">
              <div className="shipping-item">
                <FaMapMarkerAlt />
                <div>
                  <strong>{orderData.direccionEnvio.nombre}</strong>
                  <p>{orderData.direccionEnvio.direccion}</p>
                  <p>
                    {orderData.direccionEnvio.ciudad},{" "}
                    {orderData.direccionEnvio.codigoPostal}
                  </p>
                  <p>{orderData.direccionEnvio.pais}</p>
                </div>
              </div>
              <div className="shipping-item">
                <span>📞 {orderData.direccionEnvio.telefono}</span>
              </div>
              <div className="shipping-item">
                <span>📧 {orderData.direccionEnvio.email}</span>
              </div>
            </div>
          </div>

          {/* Información de pago */}
          <div className="payment-info-card">
            <div className="payment-header">
              <FaCreditCard className="payment-icon" />
              <h3>Método de Pago</h3>
            </div>
            <div className="payment-details">
              <span className="payment-method">
                {formatPaymentMethod(orderData.informacionPago.metodo)}
              </span>
              {orderData.informacionPago.metodo === "cash_on_delivery" && (
                <div className="bank-transfer-info">
                  <p>
                    <strong>Número de referencia:</strong>{" "}
                    {orderData.numeroPedido}
                  </p>
                  <p>
                    Usa este número como referencia en tu transferencia
                    bancaria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="additional-info-card">
            <div className="info-item">
              <FaCalendarAlt />
              <div>
                <span>Fecha del pedido:</span>
                <span>{formatDate(orderData.fechaPedido)}</span>
              </div>
            </div>
            <div className="info-item">
              <span>Estado:</span>
              <span className="status-pending">Pendiente de confirmación</span>
            </div>
            {orderData.puntosFidelidadGanados > 0 && (
              <div className="info-item">
                <span>Puntos ganados:</span>
                <span className="points-earned">
                  +{orderData.puntosFidelidadGanados} puntos
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="success-actions">
          <button
            className="action-btn secondary"
            onClick={handleShare}
            title="Compartir pedido"
          >
            <FaShare />
            Compartir
          </button>
          <button
            className="action-btn primary"
            onClick={onDownloadReceipt}
            title="Descargar comprobante"
          >
            <FaDownload />
            Descargar Comprobante
          </button>
        </div>

        {/* Botón de cerrar */}
        <button className="close-btn" onClick={onClose} title="Cerrar">
          <FaTimes />
        </button>

        {/* Mensaje de seguimiento */}
        <div className="tracking-message">
          <p>
            📧 Recibirás un correo de confirmación en{" "}
            <strong>{orderData.direccionEnvio.email}</strong>
          </p>
          <p>🚚 Te notificaremos cuando tu pedido esté en camino</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccessModal;
