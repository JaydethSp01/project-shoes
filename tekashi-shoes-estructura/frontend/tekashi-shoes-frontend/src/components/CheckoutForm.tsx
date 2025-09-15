import React, { useState, useEffect } from "react";
import {
  FaCreditCard,
  FaPaypal,
  FaUniversity,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaLock,
  FaTruck,
  FaGift,
  FaStar,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";
import jsPDF from "jspdf";
import {
  cartService,
  CartSummary,
  ShippingAddress,
  PaymentInfo,
  OrderInfo,
} from "../services/CartService";
import { authService } from "../services/AuthService";
// import PaymentSystem from "./PaymentSystem"; // Ya no se usa

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: OrderInfo) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [showPaymentSystem, setShowPaymentSystem] = useState(false); // Ya no se usa
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Datos del formulario
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Colombia",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "credit_card",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { id: 1, title: "Envío", icon: FaTruck },
    { id: 2, title: "Pago", icon: FaCreditCard },
    { id: 3, title: "Confirmación", icon: FaCheck },
  ];

  useEffect(() => {
    if (isOpen) {
      setCartSummary(cartService.getCartSummary());
      // Cargar datos del usuario si está autenticado
      const user = authService.getCurrentUser();
      if (user) {
        setShippingAddress((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      }
    }
  }, [isOpen]);

  const handleShippingChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const applyDiscountCode = () => {
    if (!discountCode.trim()) return;

    const result = cartService.applyDiscountCode(discountCode);
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setError("");
    } else {
      setError(result.message);
    }
  };

  const handleLoyaltyPointsChange = (points: number) => {
    const user = authService.getCurrentUser();
    const maxPoints = user?.loyaltyPoints || 0;
    const pointsToUse = Math.min(
      points,
      maxPoints,
      Math.floor((cartSummary?.subtotal || 0) / 1000)
    );
    setLoyaltyPointsUsed(pointsToUse);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          shippingAddress.name &&
          shippingAddress.email &&
          shippingAddress.phone &&
          shippingAddress.address &&
          shippingAddress.city &&
          shippingAddress.postalCode
        );
      case 2:
        // No validar datos de tarjeta - es simulado
        return true;
      case 3:
        return agreedToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setError("");
    } else {
      setError("Por favor completa todos los campos requeridos");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const processOrder = async () => {
    if (!cartSummary || !validateStep(3)) return;

    // Verificar si el usuario está logueado
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError(
        "Debes iniciar sesión para proceder con el pago. Haz clic en 'Iniciar Sesión' en el menú superior."
      );
      return;
    }

    // Verificar que no sea un administrador intentando comprar
    if (authService.isAdmin()) {
      setError(
        "Los administradores no pueden realizar compras. Usa una cuenta de usuario regular."
      );
      return;
    }

    // Procesar el pago directamente sin abrir PaymentSystem
    await handleDirectPayment();
  };

  const handleDirectPayment = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular diferentes resultados de pago (85% de éxito)
      const successRate = 0.85;
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

      // Crear datos de pago simulados
      const paymentData = {
        method: paymentInfo.method,
        amount: finalTotal,
        transactionId: `TK${Date.now()}${Math.random()
          .toString(36)
          .substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        cardData:
          paymentInfo.method === "credit_card"
            ? {
                lastFour: paymentInfo.cardNumber?.slice(-4),
                type: getCardType(paymentInfo.cardNumber),
              }
            : null,
      };

      // Procesar el pedido
      const order = await cartService.processOrder(
        shippingAddress,
        paymentInfo,
        loyaltyPointsUsed,
        paymentData
      );

      setPaymentSuccess(true);
      onOrderComplete(order);

      // Cerrar después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(
        err.message ||
          "Error al procesar el pago. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCardType = (number: string): string => {
    const num = number.replace(/\s/g, "");
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5") || num.startsWith("2")) return "Mastercard";
    if (num.startsWith("3")) return "American Express";
    return "Unknown";
  };

  // Generar número de pedido único
  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `TK-${timestamp.slice(-6)}-${random}`;
  };

  // Generar PDF del pedido
  const generateOrderPDF = () => {
    if (!cartSummary) return;

    const orderNumber = generateOrderNumber();
    const doc = new jsPDF();

    // Configuración del PDF
    doc.setFontSize(20);
    doc.setTextColor(0, 255, 136);
    doc.text("TEKASHI SHOES", 20, 30);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("COMPROBANTE DE PEDIDO", 20, 50);

    // Número de pedido
    doc.setFontSize(12);
    doc.text(`Número de Pedido: ${orderNumber}`, 20, 70);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, 20, 80);
    doc.text(`Hora: ${new Date().toLocaleTimeString("es-CO")}`, 20, 90);

    // Información del cliente
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.text("INFORMACIÓN DEL CLIENTE", 20, 110);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nombre: ${shippingAddress.name}`, 20, 125);
    doc.text(`Email: ${shippingAddress.email}`, 20, 135);
    doc.text(`Teléfono: ${shippingAddress.phone}`, 20, 145);
    doc.text(`Dirección: ${shippingAddress.address}`, 20, 155);
    doc.text(`Ciudad: ${shippingAddress.city}`, 20, 165);
    doc.text(`Código Postal: ${shippingAddress.postalCode}`, 20, 175);
    doc.text(`País: ${shippingAddress.country}`, 20, 185);

    // Método de pago
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.text("MÉTODO DE PAGO", 20, 205);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    if (paymentInfo.method === "credit_card") {
      doc.text("Tarjeta de Crédito/Débito", 20, 220);
      doc.text(`Titular: ${paymentInfo.cardholderName}`, 20, 230);
      doc.text(
        `Tarjeta: **** **** **** ${paymentInfo.cardNumber?.slice(-4)}`,
        20,
        240
      );
    } else if (paymentInfo.method === "paypal") {
      doc.text("PayPal", 20, 220);
    } else if (paymentInfo.method === "bank_transfer") {
      doc.text("Transferencia Bancaria", 20, 220);
      doc.text(`Número de Referencia: ${orderNumber}`, 20, 230);
    }

    // Productos
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.text("PRODUCTOS", 20, 260);

    let yPosition = 275;
    cartSummary.items.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${item.product.marca}`, 20, yPosition);
      doc.text(`   Cantidad: ${item.quantity}`, 25, yPosition + 8);
      doc.text(
        `   Precio unitario: $${item.product.precio.toLocaleString()}`,
        25,
        yPosition + 16
      );
      doc.text(
        `   Subtotal: $${item.total.toLocaleString()}`,
        25,
        yPosition + 24
      );
      yPosition += 35;
    });

    // Resumen de costos
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.text("RESUMEN DE COSTOS", 20, yPosition + 10);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Subtotal: $${cartSummary.subtotal.toLocaleString()}`,
      20,
      yPosition + 25
    );
    doc.text(
      `Envío: ${
        cartSummary.shipping === 0
          ? "Gratis"
          : `$${cartSummary.shipping.toLocaleString()}`
      }`,
      20,
      yPosition + 35
    );
    doc.text(
      `IVA (19%): $${cartSummary.tax.toLocaleString()}`,
      20,
      yPosition + 45
    );

    if (appliedDiscount > 0) {
      doc.text(
        `Descuento: -$${appliedDiscount.toLocaleString()}`,
        20,
        yPosition + 55
      );
    }

    if (loyaltyPointsUsed > 0) {
      doc.text(
        `Puntos de fidelidad: -$${(loyaltyPointsUsed * 100).toLocaleString()}`,
        20,
        yPosition + 65
      );
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 255, 136);
    doc.text(`TOTAL: $${finalTotal.toLocaleString()}`, 20, yPosition + 80);

    // Información adicional
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Este es un comprobante de pedido simulado para fines de demostración.",
      20,
      doc.internal.pageSize.height - 20
    );
    doc.text(
      "Tekashi Shoes - La mejor plataforma de e-commerce para calzado deportivo.",
      20,
      doc.internal.pageSize.height - 15
    );

    // Descargar PDF
    doc.save(`pedido-${orderNumber}.pdf`);
  };

  // Funciones de PaymentSystem ya no se usan
  // const handlePaymentSuccess = async (paymentData: any) => { ... }
  // const handlePaymentError = (error: string) => { ... }

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

  if (!isOpen || !cartSummary) return null;

  const finalTotal =
    cartSummary.total - appliedDiscount - loyaltyPointsUsed * 100;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="checkout-content">
          {/* Progress Steps */}
          <div className="checkout-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`step ${isActive ? "active" : ""} ${
                    isCompleted ? "completed" : ""
                  }`}
                >
                  <div className="step-icon">
                    {isCompleted ? <FaCheck /> : <Icon />}
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FaTimes />
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="step-content">
            {currentStep === 1 && (
              <div className="shipping-form">
                <h3>Información de Envío</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo *</label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        handleShippingChange("name", e.target.value)
                      }
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        handleShippingChange("email", e.target.value)
                      }
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleShippingChange("phone", e.target.value)
                      }
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Dirección *</label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleShippingChange("address", e.target.value)
                      }
                      placeholder="Calle 123 #45-67"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleShippingChange("city", e.target.value)
                      }
                      placeholder="Bogotá"
                    />
                  </div>

                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        handleShippingChange("postalCode", e.target.value)
                      }
                      placeholder="110111"
                    />
                  </div>

                  <div className="form-group">
                    <label>País</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleShippingChange("country", e.target.value)
                      }
                    >
                      <option value="Colombia">Colombia</option>
                      <option value="México">México</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Perú">Perú</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-form">
                <h3>Información de Pago</h3>

                {/* Payment Method Selection - Diseño mejorado */}
                <div className="payment-methods-grid">
                  <div
                    className={`payment-method-card ${
                      paymentInfo.method === "credit_card" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentChange("method", "credit_card")}
                  >
                    <div className="method-icon">
                      <FaCreditCard />
                    </div>
                    <div className="method-info">
                      <h4>Tarjeta de Crédito/Débito</h4>
                      <p>Visa, Mastercard, American Express</p>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentInfo.method === "credit_card"}
                      onChange={() => {}}
                      className="method-radio"
                    />
                  </div>

                  <div
                    className={`payment-method-card ${
                      paymentInfo.method === "paypal" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentChange("method", "paypal")}
                  >
                    <div className="method-icon">
                      <FaPaypal />
                    </div>
                    <div className="method-info">
                      <h4>PayPal</h4>
                      <p>Paga con tu cuenta PayPal</p>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentInfo.method === "paypal"}
                      onChange={() => {}}
                      className="method-radio"
                    />
                  </div>

                  <div
                    className={`payment-method-card ${
                      paymentInfo.method === "bank_transfer" ? "selected" : ""
                    }`}
                    onClick={() =>
                      handlePaymentChange("method", "bank_transfer")
                    }
                  >
                    <div className="method-icon">
                      <FaUniversity />
                    </div>
                    <div className="method-info">
                      <h4>Transferencia Bancaria</h4>
                      <p>Pago directo desde tu banco</p>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentInfo.method === "bank_transfer"}
                      onChange={() => {}}
                      className="method-radio"
                    />
                  </div>
                </div>

                {/* Credit Card Details */}
                {paymentInfo.method === "credit_card" && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Nombre del Titular *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardholderName}
                        onChange={(e) =>
                          handlePaymentChange("cardholderName", e.target.value)
                        }
                        placeholder="Como aparece en la tarjeta"
                      />
                    </div>

                    <div className="form-group">
                      <label>Número de Tarjeta *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          handlePaymentChange(
                            "cardNumber",
                            formatCardNumber(e.target.value)
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de Vencimiento *</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            handlePaymentChange("expiryDate", e.target.value)
                          }
                          placeholder="MM/AA"
                          maxLength={5}
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            handlePaymentChange("cvv", e.target.value)
                          }
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Discount Code */}
                <div className="discount-section">
                  <h4>Código de Descuento</h4>
                  <div className="discount-input">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Ingresa tu código de descuento"
                    />
                    <button onClick={applyDiscountCode} className="apply-btn">
                      Aplicar
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="discount-applied">
                      <FaGift />
                      Descuento aplicado: ${appliedDiscount.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Loyalty Points */}
                <div className="loyalty-section">
                  <h4>Puntos de Fidelidad</h4>
                  <div className="loyalty-input">
                    <input
                      type="number"
                      value={loyaltyPointsUsed}
                      onChange={(e) =>
                        handleLoyaltyPointsChange(Number(e.target.value))
                      }
                      placeholder="Puntos a usar"
                      min={0}
                      max={Math.floor(cartSummary.subtotal / 1000)}
                    />
                    <span className="points-info">
                      <FaStar />
                      {authService.getCurrentUser()?.loyaltyPoints || 0} puntos
                      disponibles
                    </span>
                  </div>
                  {loyaltyPointsUsed > 0 && (
                    <div className="points-discount">
                      Descuento por puntos: $
                      {(loyaltyPointsUsed * 100).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="confirmation-form">
                <h3>Confirmar Pedido</h3>

                <div className="order-summary">
                  <div className="summary-section">
                    <h4>Resumen del Pedido</h4>
                    <div className="summary-items">
                      {cartSummary.items.map((item, index) => (
                        <div key={index} className="summary-item">
                          <div className="item-info">
                            <span className="item-name">
                              {item.product.nombre}
                            </span>
                            <span className="item-details">
                              Cantidad: {item.quantity}
                              {item.size && ` | Talla: ${item.size}`}
                              {item.color && ` | Color: ${item.color}`}
                            </span>
                          </div>
                          <span className="item-price">
                            ${item.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="summary-section">
                    <h4>Dirección de Envío</h4>
                    <div className="address-info">
                      <p>
                        <strong>{shippingAddress.name}</strong>
                      </p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div className="summary-section">
                    <h4>Método de Pago</h4>
                    <div className="payment-info">
                      {paymentInfo.method === "credit_card" && (
                        <div>
                          <FaCreditCard />
                          <span>
                            Tarjeta terminada en{" "}
                            {paymentInfo.cardNumber?.slice(-4)}
                          </span>
                        </div>
                      )}
                      {paymentInfo.method === "paypal" && (
                        <div>
                          <FaPaypal />
                          <span>PayPal</span>
                        </div>
                      )}
                      {paymentInfo.method === "bank_transfer" && (
                        <div>
                          <FaUniversity />
                          <span>Transferencia Bancaria</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="terms-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Acepto los términos y condiciones de compra
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <h4>Resumen del Pedido</h4>
            <div className="summary-details">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${cartSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Envío</span>
                <span>
                  {cartSummary.shipping === 0
                    ? "Gratis"
                    : `$${cartSummary.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="summary-line">
                <span>IVA (19%)</span>
                <span>${cartSummary.tax.toLocaleString()}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="summary-line discount">
                  <span>Descuento</span>
                  <span>-${appliedDiscount.toLocaleString()}</span>
                </div>
              )}
              {loyaltyPointsUsed > 0 && (
                <div className="summary-line discount">
                  <span>Puntos de fidelidad</span>
                  <span>-${(loyaltyPointsUsed * 100).toLocaleString()}</span>
                </div>
              )}
              <div className="summary-line total">
                <span>Total</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Botón de descarga de PDF */}
            <div className="pdf-download-section">
              <button
                className="btn-download-pdf"
                onClick={generateOrderPDF}
                title="Descargar comprobante de pedido en PDF"
              >
                <FaFilePdf />
                Descargar Comprobante
              </button>

              {paymentInfo.method === "bank_transfer" && (
                <div className="bank-transfer-info">
                  <h5>Transferencia Bancaria</h5>
                  <p>
                    Número de referencia:{" "}
                    <strong>{generateOrderNumber()}</strong>
                  </p>
                  <p>
                    Usa este número como referencia en tu transferencia
                    bancaria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="checkout-footer">
          <div className="footer-info">
            <FaLock />
            <span>Compra 100% segura</span>
          </div>

          <div className="footer-actions">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button className="btn-primary" onClick={nextStep}>
                Continuar
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={processOrder}
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinning" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Finalizar Compra
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment System Modal ya no se usa - integrado en el flujo principal */}

      {/* Payment Success Message */}
      {paymentSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <FaCheck className="success-icon" />
            <h3>¡Pago Exitoso!</h3>
            <p>Tu pedido ha sido procesado correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
