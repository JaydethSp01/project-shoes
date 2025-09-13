import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingCart,
  FaCheck,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { CartItem } from "../services/CartService";
import {
  guestCheckoutService,
  GuestUser,
} from "../services/GuestCheckoutService";

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  total,
  onClose,
  onSuccess,
}) => {
  const [userData, setUserData] = useState<UserData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("tarjeta");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos personales, 2: Confirmación

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const required = [
      "nombre",
      "apellido",
      "email",
      "telefono",
      "direccion",
      "ciudad",
      "codigoPostal",
    ];

    for (const field of required) {
      if (!userData[field as keyof UserData].trim()) {
        alert(`Por favor completa el campo: ${field}`);
        return false;
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert("Por favor ingresa un email válido");
      return false;
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userData.telefono)) {
      alert("Por favor ingresa un teléfono válido de 10 dígitos");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Crear orden de invitado
      const guestInfo: GuestUser = {
        name: `${userData.nombre} ${userData.apellido}`,
        email: userData.email,
        phone: userData.telefono,
        address: userData.direccion,
        city: userData.ciudad,
        postalCode: userData.codigoPostal,
      };

      const order = await guestCheckoutService.createGuestOrder(
        guestInfo,
        cartItems,
        paymentMethod
      );

      // Mostrar mensaje de éxito con detalles de la orden
      alert(
        `¡Compra exitosa!\n\nNúmero de orden: ${
          order.id
        }\nTotal: $${total.toLocaleString()}\nMétodo de pago: ${paymentMethod}\n\nSe ha enviado un email de confirmación a ${
          userData.email
        }`
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error procesando compra:", error);
      alert("Error procesando la compra. Por favor intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="checkout-overlay"
      onClick={(e) => {
        // Solo cerrar si se hace clic directamente en el overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="checkout-container"
        onClick={(e) => {
          // Prevenir que el clic en el container cierre el modal
          e.stopPropagation();
        }}
      >
        <div className="checkout-header">
          <h2>
            <FaShoppingCart className="me-2" />
            Finalizar Compra
          </h2>
          <button className="checkout-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="checkout-content">
          {step === 1 ? (
            <div className="checkout-form">
              <div className="form-section">
                <h3>
                  <FaUser className="me-2" />
                  Información Personal
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={userData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      name="apellido"
                      value={userData.apellido}
                      onChange={handleInputChange}
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaEnvelope className="me-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaPhone className="me-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={userData.telefono}
                      onChange={handleInputChange}
                      placeholder="3001234567"
                      required
                    />
                  </div>
                </div>

                <h3>
                  <FaMapMarkerAlt className="me-2" />
                  Dirección de Envío
                </h3>
                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={userData.direccion}
                    onChange={handleInputChange}
                    placeholder="Calle 123 #45-67"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={userData.ciudad}
                      onChange={handleInputChange}
                      placeholder="Bogotá"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={userData.codigoPostal}
                      onChange={handleInputChange}
                      placeholder="110111"
                      required
                    />
                  </div>
                </div>

                <h3>
                  <FaCreditCard className="me-2" />
                  Método de Pago
                </h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="tarjeta"
                      checked={paymentMethod === "tarjeta"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Tarjeta de Crédito/Débito</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="efectivo"
                      checked={paymentMethod === "efectivo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💰 Pago contra entrega</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🏦 Transferencia bancaria</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="checkout-summary">
              <h3>Resumen de tu Compra</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.product.idProducto} className="summary-item">
                    <div className="item-info">
                      <h4>{item.product.marca}</h4>
                      <p>{item.product.color}</p>
                      <span>Cantidad: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.product.precio * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <h3>Total: {formatPrice(total)}</h3>
              </div>
            </div>
          )}

          <div className="checkout-actions">
            {step === 1 ? (
              <>
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={isProcessing}
                >
                  Continuar
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Atrás
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="spinning me-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" />
                      Confirmar Compra
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
