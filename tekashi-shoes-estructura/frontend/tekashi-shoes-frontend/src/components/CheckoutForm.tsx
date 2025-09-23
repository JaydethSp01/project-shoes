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
import { useGeolocation } from "../hooks/useGeolocation";
import { useTranslation } from "../hooks/useTranslation";
// import InteractiveMap from "./InteractiveMap"; // No se usa actualmente
import AddressSelectorModal from "./AddressSelectorModal";
import InlineNotification from "./InlineNotification";
// import PaymentSystem from "./PaymentSystem"; // Ya no se usa
import "../styles/CheckoutForm.css";

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: OrderInfo) => void;
  onShowError?: (title: string, message: string) => void;
  onShowSuccess?: (title: string, message: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(""); // No se muestra en el UI actualmente
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
    country: t("additional.colombia"),
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
  // const [showMap, setShowMap] = useState(false); // No se usa actualmente
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Hook para geolocalización
  const {
    location,
    address,
    error: locationError,
    loading: locationLoading,
    getCurrentLocation,
    getAddressFromLocation,
  } = useGeolocation();

  const steps = [
    { id: 1, title: t("additional.shipping"), icon: FaTruck },
    { id: 2, title: t("additional.payment"), icon: FaCreditCard },
    { id: 3, title: t("additional.confirmation"), icon: FaCheck },
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

  // Efecto para manejar la geolocalización cuando se obtiene la ubicación
  useEffect(() => {
    if (location && !address) {
      // Obtener dirección desde las coordenadas
      getAddressFromLocation(location.latitude, location.longitude);
    }
  }, [location, address, getAddressFromLocation]);

  // Efecto para actualizar la dirección cuando se obtiene
  useEffect(() => {
    if (address && location) {
      setShippingAddress((prev) => ({
        ...prev,
        address: address.address,
        city: address.city,
        country: address.country,
        postalCode: address.postalCode,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));

      // Mostrar notificación de éxito
      setNotification({
        type: "success",
        message: "📍 Ubicación detectada y agregada automáticamente",
      });
    }
  }, [address, location]);

  // Efecto para manejar errores de geolocalización
  useEffect(() => {
    if (locationError) {
      setNotification({
        type: "error",
        message: `❌ Error de Geolocalización: ${locationError.message}`,
      });
    }
  }, [locationError]);

  const handleShippingChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  // const handleMapLocationSelect = (mapLocation: {
  //   lat: number;
  //   lng: number;
  //   address?: string;
  // }) => {
  //   setShippingAddress((prev) => ({
  //     ...prev,
  //     coordinates: {
  //       latitude: mapLocation.lat,
  //       longitude: mapLocation.lng,
  //     },
  //     address: mapLocation.address || prev.address,
  //   }));
  //   setShowMap(false);
  // }; // No se usa actualmente

  const handleAddressModalSelect = (addressData: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  }) => {
    setShippingAddress((prev) => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      country: addressData.country,
      postalCode: addressData.postalCode,
      coordinates: {
        latitude: addressData.lat,
        longitude: addressData.lng,
      },
    }));
    setShowAddressModal(false);
    setNotification({
      type: "success",
      message: "✅ Dirección seleccionada desde el mapa",
    });
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const applyDiscountCode = () => {
    if (!discountCode.trim()) return;

    const result = cartService.applyDiscountCode(discountCode);
    if (result.valid) {
      setAppliedDiscount(result.discount);
      // setError(""); // No se muestra en el UI actualmente
    } else {
      // setError(result.message); // No se muestra en el UI actualmente
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
      // setError(""); // No se muestra en el UI actualmente
    } else {
      // setError(t("additional.pleaseCompleteAllFields")); // No se muestra en el UI actualmente
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    // setError(""); // No se muestra en el UI actualmente
  };

  const processOrder = async () => {
    if (!cartSummary || !validateStep(3)) return;

    // Verificar si el usuario está logueado
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // Permitir checkout como invitado sin confirmación
      // El modal de login ya se mostró en el carrito
    }

    // Verificar que no sea un administrador intentando comprar
    if (authService.isAdmin()) {
      const continueAsAdmin = window.confirm(
        "⚠️ Estás logueado como administrador.\n\n" +
          "¿Quieres continuar con la compra usando tu cuenta de administrador?\n\n" +
          "• Aceptar: Continuar como admin\n" +
          "• Cancelar: Cerrar sesión y usar cuenta de usuario"
      );

      if (!continueAsAdmin) {
        return;
      }
    }

    // Procesar el pago directamente sin abrir PaymentSystem
    await handleDirectPayment();
  };

  const handleDirectPayment = async () => {
    setIsLoading(true);

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular diferentes resultados de pago (85% de éxito)
      const successRate = 0.85;
      const isSuccess = Math.random() < successRate;

      if (!isSuccess) {
        const errorMessages = [
          t("additional.cardRejectedByBank"),
          t("additional.insufficientFunds"),
          t("additional.cardExpired"),
          t("additional.paymentProcessorError"),
          t("additional.cardBlocked"),
        ];
        throw new Error(
          errorMessages[Math.floor(Math.random() * errorMessages.length)]
        );
      }

      // Crear datos de pago simulados
      // const paymentData = {
      //   method: paymentInfo.method,
      //   amount: finalTotal,
      //   transactionId: `TK${Date.now()}${Math.random()
      //     .toString(36)
      //     .substr(2, 5)}`,
      //   timestamp: new Date().toISOString(),
      //   cardData:
      //     paymentInfo.method === "credit_card"
      //       ? {
      //           lastFour: paymentInfo.cardNumber?.slice(-4),
      //           type: getCardType(paymentInfo.cardNumber || ""),
      //         }
      //       : null,
      // };

      // Procesar el pedido
      const order = await cartService.processOrder(
        shippingAddress,
        paymentInfo,
        loyaltyPointsUsed
      );

      setPaymentSuccess(true);
      onOrderComplete(order);

      // Cerrar después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: unknown) {
      console.error("Error de Pago:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // const getCardType = (number: string): string => {
  //   const num = number.replace(/\s/g, "");
  //   if (num.startsWith("4")) return "Visa";
  //   if (num.startsWith("5") || num.startsWith("2")) return "Mastercard";
  //   if (num.startsWith("3")) return "American Express";
  //   return "Unknown";
  // };

  // Generar número de pedido único
  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `TK-${timestamp.slice(-6)}-${random}`;
  };

  // Generar PDF del pedido con diseño moderno
  const generateOrderPDF = () => {
    if (!cartSummary) return;

    const orderNumber = generateOrderNumber();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colores del tema (definidos para referencia futura)
    // const primaryColor = [0, 255, 136]; // Verde Tekashi
    // const darkColor = [26, 26, 26]; // Negro
    // const grayColor = [128, 128, 128]; // Gris
    // const lightGrayColor = [240, 240, 240]; // Gris claro

    // ========== HEADER CON GRADIENTE SIMULADO ==========
    // Fondo del header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, pageWidth, 50, "F");

    // Logo/Título principal
    doc.setFontSize(24);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("TEKASHI SHOES", 20, 25);

    // Subtítulo
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("FACTURA DE VENTA", pageWidth - 80, 25);

    // Línea decorativa
    doc.setDrawColor(0, 255, 136);
    doc.setLineWidth(2);
    doc.line(20, 35, pageWidth - 20, 35);

    // ========== INFORMACIÓN DE LA FACTURA ==========
    let yPos = 60;

    // Fondo para información de factura
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPos, pageWidth - 40, 40, "F");

    // Título de la sección
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DE LA FACTURA", 25, yPos + 12);

    // Detalles de la factura
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = currentDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.text(`Número de Factura: ${orderNumber}`, 25, yPos + 22);
    doc.text(`Fecha de Emisión: ${dateStr}`, 25, yPos + 30);
    doc.text(`Hora: ${timeStr}`, pageWidth - 80, yPos + 22);
    doc.text(`Estado: Pagado`, pageWidth - 80, yPos + 30);

    yPos += 50;

    // ========== INFORMACIÓN DEL CLIENTE ==========
    // Fondo para información del cliente
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPos, pageWidth - 40, 60, "F");

    // Título de la sección
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL CLIENTE", 25, yPos + 12);

    // Datos del cliente
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    doc.text(`Nombre: ${shippingAddress.name}`, 25, yPos + 22);
    doc.text(`Email: ${shippingAddress.email}`, 25, yPos + 30);
    doc.text(`Teléfono: ${shippingAddress.phone}`, 25, yPos + 38);
    doc.text(`Dirección: ${shippingAddress.address}`, 25, yPos + 46);
    doc.text(`Ciudad: ${shippingAddress.city}`, pageWidth - 100, yPos + 22);
    doc.text(
      `Código Postal: ${shippingAddress.postalCode}`,
      pageWidth - 100,
      yPos + 30
    );
    doc.text(`País: ${shippingAddress.country}`, pageWidth - 100, yPos + 38);

    yPos += 70;

    // ========== MÉTODO DE PAGO ==========
    // Fondo para método de pago
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPos, pageWidth - 40, 40, "F");

    // Título de la sección
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("MÉTODO DE PAGO", 25, yPos + 12);

    // Información de pago
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    if (paymentInfo.method === "credit_card") {
      doc.text("Tarjeta de Crédito/Débito", 25, yPos + 22);
      doc.text(`Titular: ${paymentInfo.cardholderName}`, 25, yPos + 30);
      doc.text(
        `Tarjeta: **** **** **** ${paymentInfo.cardNumber?.slice(-4)}`,
        pageWidth - 100,
        yPos + 22
      );
    } else if (paymentInfo.method === "paypal") {
      doc.text("PayPal", 25, yPos + 22);
      doc.text("Pago procesado exitosamente", 25, yPos + 30);
    } else if (paymentInfo.method === "cash_on_delivery") {
      doc.text("Transferencia Bancaria", 25, yPos + 22);
      doc.text(`Número de Referencia: ${orderNumber}`, 25, yPos + 30);
    }

    yPos += 50;

    // ========== TABLA DE PRODUCTOS ==========
    // Título de la sección
    doc.setFontSize(14);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLE DE PRODUCTOS", 20, yPos);

    yPos += 10;

    // Encabezados de la tabla
    doc.setFillColor(0, 255, 136);
    doc.rect(20, yPos, pageWidth - 40, 15, "F");

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("PRODUCTO", 25, yPos + 10);
    doc.text("CANT.", 120, yPos + 10);
    doc.text("PRECIO UNIT.", 150, yPos + 10);
    doc.text("SUBTOTAL", pageWidth - 60, yPos + 10);

    yPos += 20;

    // Filas de productos
    cartSummary.items.forEach((item, index) => {
      // Fondo alternado para filas
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, pageWidth - 40, 20, "F");
      }

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      // Nombre del producto (truncado si es muy largo)
      const productName =
        item.product.marca.length > 25
          ? item.product.marca.substring(0, 25) + "..."
          : item.product.marca;

      doc.text(productName, 25, yPos + 5);
      doc.text(item.quantity.toString(), 120, yPos + 5);
      doc.text(`$${item.product.precio.toLocaleString()}`, 150, yPos + 5);
      doc.text(`$${item.total.toLocaleString()}`, pageWidth - 60, yPos + 5);

      yPos += 20;
    });

    yPos += 10;

    // ========== RESUMEN DE COSTOS ==========
    // Fondo para resumen
    doc.setFillColor(248, 249, 250);
    doc.rect(pageWidth - 120, yPos, 100, 80, "F");

    // Título del resumen
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN", pageWidth - 115, yPos + 10);

    // Línea separadora
    doc.setDrawColor(0, 255, 136);
    doc.setLineWidth(1);
    doc.line(pageWidth - 115, yPos + 15, pageWidth - 25, yPos + 15);

    // Detalles del resumen
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    let summaryY = yPos + 25;

    doc.text(`Subtotal:`, pageWidth - 115, summaryY);
    doc.text(
      `$${cartSummary.subtotal.toLocaleString()}`,
      pageWidth - 40,
      summaryY
    );
    summaryY += 8;

    doc.text(`Envío:`, pageWidth - 115, summaryY);
    doc.text(
      cartSummary.shipping === 0
        ? "Gratis"
        : `$${cartSummary.shipping.toLocaleString()}`,
      pageWidth - 40,
      summaryY
    );
    summaryY += 8;

    doc.text(`IVA (19%):`, pageWidth - 115, summaryY);
    doc.text(`$${cartSummary.tax.toLocaleString()}`, pageWidth - 40, summaryY);
    summaryY += 8;

    if (appliedDiscount > 0) {
      doc.setTextColor(220, 53, 69); // Rojo para descuentos
      doc.text(`Descuento:`, pageWidth - 115, summaryY);
      doc.text(
        `-$${appliedDiscount.toLocaleString()}`,
        pageWidth - 40,
        summaryY
      );
      summaryY += 8;
      doc.setTextColor(0, 0, 0);
    }

    if (loyaltyPointsUsed > 0) {
      doc.setTextColor(220, 53, 69); // Rojo para descuentos
      doc.text(`Puntos:`, pageWidth - 115, summaryY);
      doc.text(
        `-$${(loyaltyPointsUsed * 100).toLocaleString()}`,
        pageWidth - 40,
        summaryY
      );
      summaryY += 8;
      doc.setTextColor(0, 0, 0);
    }

    // Línea separadora antes del total
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(pageWidth - 115, summaryY + 2, pageWidth - 25, summaryY + 2);
    summaryY += 8;

    // Total
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, pageWidth - 115, summaryY);
    doc.text(`$${finalTotal.toLocaleString()}`, pageWidth - 40, summaryY);

    // ========== PIE DE PÁGINA ==========
    const footerY = pageHeight - 40;

    // Línea superior del pie
    doc.setDrawColor(0, 255, 136);
    doc.setLineWidth(2);
    doc.line(20, footerY, pageWidth - 20, footerY);

    // Información de la empresa
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("TEKASHI SHOES - Calzado de Alta Calidad", 20, footerY + 10);
    doc.text(
      "www.tekashishoes.com | contacto@tekashishoes.com",
      20,
      footerY + 18
    );
    doc.text("Tel: +57 300 123 4567 | Bogotá, Colombia", 20, footerY + 26);

    // Mensaje de agradecimiento
    doc.setTextColor(0, 255, 136);
    doc.setFont("helvetica", "bold");
    doc.text("¡Gracias por su compra!", pageWidth - 80, footerY + 10);
    doc.text(
      "Su pedido será procesado en 24-48 horas",
      pageWidth - 80,
      footerY + 18
    );

    // ========== MARCA DE AGUA (OPCIONAL) ==========
    // Agregar marca de agua sutil
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
      doc.setFontSize(60);
      doc.setTextColor(200, 200, 200);
      doc.setFont("helvetica", "bold");
      doc.text("TEKASHI", pageWidth / 2 - 60, pageHeight / 2, { angle: 45 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
    } catch {
      // Si no se puede agregar marca de agua, continuar sin ella
      console.log("No se pudo agregar marca de agua al PDF");
    }

    // Guardar el PDF
    doc.save(`factura-${orderNumber}.pdf`);
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
    <div
      className="checkout-overlay"
      onClick={(e) => {
        // Solo cerrar si se hace clic en el overlay, no en el modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="checkout-content">
          {/* Progress Steps */}
          <div className="checkout-steps">
            {steps.map((step) => {
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

          {/* Error messages now shown as global alerts */}

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
                      placeholder={t("additional.yourFullName")}
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
                    <div className="address-input-group">
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          handleShippingChange("address", e.target.value)
                        }
                        placeholder="Calle 123 #45-67"
                      />
                      <div className="location-buttons">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await getCurrentLocation();
                            } catch (error) {
                              console.error(
                                "Error obteniendo ubicación:",
                                error
                              );
                            }
                          }}
                          disabled={locationLoading}
                        >
                          {locationLoading ? (
                            <>
                              <FaSpinner className="spinning" />
                              Detectando...
                            </>
                          ) : (
                            <>📍 USAR MI UBICACIÓN</>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowAddressModal(true);
                          }}
                        >
                          🗺️ Seleccionar en mapa
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mapa interactivo removido - ahora se usa el modal */}

                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleShippingChange("city", e.target.value)
                      }
                      placeholder={t("additional.bogota")}
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
                      <option value="Colombia">
                        {t("additional.colombia")}
                      </option>
                      <option value="México">{t("additional.mexico")}</option>
                      <option value="Argentina">
                        {t("additional.argentina")}
                      </option>
                      <option value="Chile">{t("additional.chile")}</option>
                      <option value="Perú">{t("additional.peru")}</option>
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
                      paymentInfo.method === "cash_on_delivery"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePaymentChange("method", "cash_on_delivery")
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
                      value="cash_on_delivery"
                      checked={paymentInfo.method === "cash_on_delivery"}
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
                        placeholder={t("additional.asItAppearsOnCard")}
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
                      placeholder={t("additional.enterDiscountCode")}
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
                      placeholder={t("additional.pointsToUse")}
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
                      {paymentInfo.method === "cash_on_delivery" && (
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
                    ? t("additional.free")
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

              {paymentInfo.method === "cash_on_delivery" && (
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

      {/* Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressSelect={handleAddressModalSelect}
        initialAddress={
          shippingAddress.coordinates
            ? {
                lat: shippingAddress.coordinates.latitude,
                lng: shippingAddress.coordinates.longitude,
                address: shippingAddress.address,
              }
            : undefined
        }
      />

      {/* Inline Notification */}
      {notification && (
        <InlineNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CheckoutForm;
