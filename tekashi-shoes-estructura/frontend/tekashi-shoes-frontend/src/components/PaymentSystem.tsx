import React, { useState } from "react";
import {
  FaCreditCard,
  FaPaypal,
  FaGooglePay,
  FaApplePay,
  FaLock,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/PaymentSystem.css";

interface PaymentSystemProps {
  total: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({
  total,
  onPaymentSuccess,
  onPaymentError,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: <FaCreditCard />,
      description: "Visa, Mastercard, American Express",
      enabled: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <FaPaypal />,
      description: "Paga con tu cuenta PayPal",
      enabled: true,
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: <FaGooglePay />,
      description: "Pago rápido con Google Pay",
      enabled: false,
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: <FaApplePay />,
      description: "Pago rápido con Apple Pay",
      enabled: false,
    },
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateCardData = (): boolean => {
    const newErrors: string[] = [];

    if (!cardData.number || cardData.number.replace(/\s/g, "").length < 16) {
      newErrors.push("Número de tarjeta inválido");
    }

    if (!cardData.expiry || cardData.expiry.length < 5) {
      newErrors.push("Fecha de expiración inválida");
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.push("CVV inválido");
    }

    if (!cardData.name || cardData.name.length < 2) {
      newErrors.push("Nombre del titular requerido");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const simulatePayment = async (): Promise<boolean> => {
    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular diferentes resultados de pago
    const successRate = 0.85; // 85% de éxito
    const isSuccess = Math.random() < successRate;

    if (!isSuccess) {
      const errorMessages = [
        "Tarjeta rechazada por el banco",
        "Fondos insuficientes",
        "Tarjeta expirada",
        "Error en el procesador de pagos",
        "Tarjeta bloqueada",
      ];
      throw new Error(
        errorMessages[Math.floor(Math.random() * errorMessages.length)]
      );
    }

    return true;
  };

  const handlePayment = async () => {
    if (selectedMethod === "card") {
      if (!validateCardData()) {
        return;
      }
    }

    setIsProcessing(true);
    setErrors([]);

    try {
      const success = await simulatePayment();

      if (success) {
        const paymentData = {
          method: selectedMethod,
          amount: total,
          transactionId: `TK${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 5)}`,
          timestamp: new Date().toISOString(),
          cardData:
            selectedMethod === "card"
              ? {
                  lastFour: cardData.number.slice(-4),
                  type: getCardType(cardData.number),
                }
              : null,
        };

        onPaymentSuccess(paymentData);
      }
    } catch (error: any) {
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (number: string): string => {
    const num = number.replace(/\s/g, "");
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5") || num.startsWith("2")) return "Mastercard";
    if (num.startsWith("3")) return "American Express";
    return "Unknown";
  };

  const getMaskedCardNumber = (): string => {
    if (cardData.number.length > 4) {
      const lastFour = cardData.number.slice(-4);
      return "**** **** **** " + lastFour;
    }
    return cardData.number;
  };

  return (
    <div className="payment-overlay">
      <div className="payment-container">
        <div className="payment-header">
          <h2>
            <FaLock className="payment-icon" />
            Pago Seguro
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-content">
          <div className="payment-summary">
            <h3>Resumen del Pedido</h3>
            <div className="summary-item">
              <span>Total a Pagar:</span>
              <span className="total-amount">${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Método de Pago</h3>
            <div className="methods-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`method-card ${
                    selectedMethod === method.id ? "selected" : ""
                  } ${!method.enabled ? "disabled" : ""}`}
                  onClick={() => method.enabled && setSelectedMethod(method.id)}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    <p>{method.description}</p>
                  </div>
                  {!method.enabled && (
                    <div className="coming-soon">Próximamente</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedMethod === "card" && (
            <div className="card-form">
              <h3>Datos de la Tarjeta</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Número de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        number: formatCardNumber(e.target.value),
                      })
                    }
                    maxLength={19}
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Expiración</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        expiry: formatExpiry(e.target.value),
                      })
                    }
                    maxLength={5}
                  />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <div className="cvv-input">
                    <input
                      type={showCvv ? "text" : "password"}
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cvv: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      maxLength={4}
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setShowCvv(!showCvv)}
                    >
                      {showCvv ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Nombre del Titular</label>
                  <input
                    type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={cardData.name}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        name: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "paypal" && (
            <div className="paypal-info">
              <div className="paypal-card">
                <FaPaypal className="paypal-icon" />
                <h4>Redirigiendo a PayPal</h4>
                <p>
                  Serás redirigido a PayPal para completar tu pago de forma
                  segura.
                </p>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="payment-errors">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  <FaTimes className="error-icon" />
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="payment-security">
            <FaLock className="security-icon" />
            <span>
              Tus datos están protegidos con encriptación SSL de 256 bits
            </span>
          </div>

          <div className="payment-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="spinner" />
                  Procesando...
                </>
              ) : (
                <>
                  <FaCheck />
                  Pagar ${total.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;

