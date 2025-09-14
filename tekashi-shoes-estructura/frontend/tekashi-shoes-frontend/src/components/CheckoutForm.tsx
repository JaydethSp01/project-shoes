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
} from "react-icons/fa";
import {
  cartService,
  CartSummary,
  ShippingAddress,
  PaymentInfo,
  OrderInfo,
} from "../services/CartService";
import { authService } from "../services/AuthService";

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
        if (paymentInfo.method === "credit_card") {
          return !!(
            paymentInfo.cardholderName &&
            paymentInfo.cardNumber &&
            paymentInfo.expiryDate &&
            paymentInfo.cvv
          );
        }
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

    setIsLoading(true);
    setError("");

    try {
      const order = await cartService.processOrder(
        shippingAddress,
        paymentInfo,
        loyaltyPointsUsed
      );

      onOrderComplete(order);
      onClose();
    } catch (err) {
      setError("Error al procesar el pedido. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

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

                {/* Payment Method Selection */}
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentInfo.method === "credit_card"}
                      onChange={(e) =>
                        handlePaymentChange("method", e.target.value)
                      }
                    />
                    <div className="payment-option">
                      <FaCreditCard />
                      <span>Tarjeta de Crédito</span>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentInfo.method === "paypal"}
                      onChange={(e) =>
                        handlePaymentChange("method", e.target.value)
                      }
                    />
                    <div className="payment-option">
                      <FaPaypal />
                      <span>PayPal</span>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentInfo.method === "bank_transfer"}
                      onChange={(e) =>
                        handlePaymentChange("method", e.target.value)
                      }
                    />
                    <div className="payment-option">
                      <FaUniversity />
                      <span>Transferencia Bancaria</span>
                    </div>
                  </label>
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
    </div>
  );
};

export default CheckoutForm;
