import { Product } from "../modelos/productTypes";
import { notificationService } from "./NotificationService";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  total: number;
  addedAt: Date;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentInfo {
  method: "credit_card" | "paypal" | "bank_transfer";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface OrderInfo {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

class CartService {
  private cartItems: CartItem[] = [];
  private listeners: ((items: CartItem[]) => void)[] = [];
  private baseUrl = "https://project-shoes.onrender.com/api";

  constructor() {
    this.loadFromStorage();
  }

  // Suscribirse a cambios en el carrito
  subscribe(listener: (items: CartItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notificar a todos los listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.cartItems]));
  }

  // Cargar desde localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem("tekashi_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cartItems = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        this.notifyListeners();
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  }

  // Guardar en localStorage
  private saveToStorage() {
    try {
      localStorage.setItem("tekashi_cart", JSON.stringify(this.cartItems));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  // Agregar producto al carrito
  addToCart(
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ): void {
    const existingItemIndex = this.cartItems.findIndex(
      (item) =>
        item.product.idProducto === product.idProducto &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad existente
      this.cartItems[existingItemIndex].quantity += quantity;
      this.cartItems[existingItemIndex].total =
        this.cartItems[existingItemIndex].quantity *
        this.cartItems[existingItemIndex].price;
    } else {
      // Agregar nuevo item
      const price = product.precio || 0;
      const newItem: CartItem = {
        product,
        quantity,
        size,
        color,
        price,
        total: price * quantity,
        addedAt: new Date(),
      };
      this.cartItems.push(newItem);
    }

    this.saveToStorage();
    this.notifyListeners();
    notificationService.showNotification(
      `${product.marca} agregado al carrito`,
      "success"
    );
  }

  // Remover producto del carrito
  removeFromCart(productId: number, size?: string, color?: string): void {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(
      (item) =>
        !(
          item.product.idProducto === productId &&
          item.size === size &&
          item.color === color
        )
    );

    if (this.cartItems.length < initialLength) {
      this.saveToStorage();
      this.notifyListeners();
      notificationService.showNotification(
        "Producto removido del carrito",
        "info"
      );
    }
  }

  // Actualizar cantidad de un producto
  updateQuantity(
    productId: number,
    quantity: number,
    size?: string,
    color?: string
  ): void {
    const item = this.cartItems.find(
      (item) =>
        item.product.idProducto === productId &&
        item.size === size &&
        item.color === color
    );

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId, size, color);
      } else {
        item.quantity = quantity;
        item.total = item.price * quantity;
        this.saveToStorage();
        this.notifyListeners();
      }
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartItems = [];
    this.saveToStorage();
    this.notifyListeners();
    notificationService.showNotification("Carrito vaciado", "info");
  }

  // Obtener todos los items del carrito
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Obtener cantidad total de items
  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener resumen del carrito
  getCartSummary(): CartSummary {
    const subtotal = this.cartItems.reduce(
      (total, item) => total + item.total,
      0
    );
    const tax = subtotal * 0.19; // 19% IVA
    const shipping = subtotal > 500000 ? 0 : 15000; // Envío gratis sobre $500k
    const discount = this.calculateDiscount(subtotal);
    const total = subtotal + tax + shipping - discount;

    return {
      items: [...this.cartItems],
      subtotal,
      tax,
      shipping,
      discount,
      total,
      itemCount: this.getItemCount(),
    };
  }

  // Calcular descuento
  private calculateDiscount(subtotal: number): number {
    // Descuentos por volumen
    if (subtotal >= 1000000) return subtotal * 0.15; // 15% sobre $1M
    if (subtotal >= 500000) return subtotal * 0.1; // 10% sobre $500k
    if (subtotal >= 200000) return subtotal * 0.05; // 5% sobre $200k
    return 0;
  }

  // Verificar si un producto está en el carrito
  isInCart(productId: number, size?: string, color?: string): boolean {
    return this.cartItems.some(
      (item) =>
        item.product.idProducto === productId &&
        item.size === size &&
        item.color === color
    );
  }

  // Obtener cantidad de un producto específico en el carrito
  getProductQuantity(productId: number, size?: string, color?: string): number {
    const item = this.cartItems.find(
      (item) =>
        item.product.idProducto === productId &&
        item.size === size &&
        item.color === color
    );
    return item ? item.quantity : 0;
  }

  // Procesar pedido
  async processOrder(
    shippingAddress: ShippingAddress,
    paymentInfo: PaymentInfo,
    loyaltyPointsUsed: number = 0
  ): Promise<OrderInfo> {
    const cartSummary = this.getCartSummary();

    // Aplicar descuento por puntos de fidelidad
    const pointsDiscount = loyaltyPointsUsed * 100; // 1 punto = $100
    const finalTotal = Math.max(0, cartSummary.total - pointsDiscount);

    const order: OrderInfo = {
      id: this.generateOrderId(),
      items: [...cartSummary.items],
      shippingAddress,
      paymentInfo,
      subtotal: cartSummary.subtotal,
      tax: cartSummary.tax,
      shipping: cartSummary.shipping,
      discount: cartSummary.discount + pointsDiscount,
      total: finalTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: this.calculateEstimatedDelivery(),
    };

    try {
      // En una implementación real, aquí se enviaría al backend
      await this.sendOrderToBackend(order);

      // Limpiar carrito después del pedido exitoso
      this.clearCart();

      notificationService.showNotification(
        `Pedido #${order.id} procesado exitosamente`,
        "success"
      );

      return order;
    } catch (error) {
      console.error("Error processing order:", error);
      throw new Error("Error al procesar el pedido");
    }
  }

  // Enviar pedido al backend
  private async sendOrderToBackend(order: OrderInfo): Promise<void> {
    try {
      // Preparar los detalles del pedido en el formato esperado por el backend
      const detalles = order.items.map((item) => ({
        productoId: item.product.id,
        cantidad: item.quantity,
        precioUnitario: item.product.precio,
        subtotal: item.product.precio * item.quantity,
      }));

      // Preparar la dirección de envío
      const direccionEnvio = {
        nombre: order.shippingAddress.name,
        email: order.shippingAddress.email,
        telefono: order.shippingAddress.phone,
        direccion: order.shippingAddress.address,
        ciudad: order.shippingAddress.city,
        codigoPostal: order.shippingAddress.postalCode,
        pais: order.shippingAddress.country,
        coordenadas: order.shippingAddress.coordinates || undefined,
      };

      // Preparar la información de pago
      const informacionPago = {
        metodo: order.paymentInfo.method,
        numeroTarjeta: order.paymentInfo.cardNumber,
        nombreTitular: order.paymentInfo.cardName,
        fechaVencimiento: order.paymentInfo.expiryDate,
        codigoSeguridad: order.paymentInfo.cvv,
        transaccionId: order.paymentInfo.transactionId,
      };

      const pedidoData = {
        detalles,
        direccionEnvio,
        informacionPago,
        costoEnvio: order.shipping,
        descuento: order.discount,
        puntosFidelidadUsados: order.loyaltyPointsUsed || 0,
        notas: order.notes || "",
        metodoEnvio: "standard",
      };

      const response = await fetch(`${this.baseUrl}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Agregar token de autenticación si está disponible
          ...(await this.getAuthHeaders()),
        },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al procesar el pedido en el servidor"
        );
      }

      const result = await response.json();
      console.log("Order sent to backend:", result);
    } catch (error) {
      console.error("Error sending order to backend:", error);
      throw error; // Re-lanzar el error para que sea manejado por el componente
    }
  }

  // Obtener headers de autenticación
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { firebaseAuthService } = await import("./FirebaseAuthService");
      const token = await firebaseAuthService.getIdToken();
      return {
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.warn("No se pudo obtener token de autenticación");
      return {};
    }
  }

  // Generar ID único para el pedido
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TK-${timestamp}-${random}`.toUpperCase();
  }

  // Calcular fecha estimada de entrega
  private calculateEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 días hábiles
    return deliveryDate.toISOString().split("T")[0];
  }

  // Aplicar código de descuento
  applyDiscountCode(code: string): {
    valid: boolean;
    discount: number;
    message: string;
  } {
    const discountCodes: {
      [key: string]: { type: "percentage" | "fixed"; value: number };
    } = {
      WELCOME10: { type: "percentage", value: 10 },
      SAVE50: { type: "fixed", value: 50000 },
      NEWUSER: { type: "percentage", value: 15 },
      FREESHIP: { type: "fixed", value: 15000 },
    };

    const discount = discountCodes[code.toUpperCase()];

    if (!discount) {
      return {
        valid: false,
        discount: 0,
        message: "Código de descuento inválido",
      };
    }

    const cartSummary = this.getCartSummary();
    let discountAmount = 0;

    if (discount.type === "percentage") {
      discountAmount = cartSummary.subtotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, cartSummary.subtotal);
    }

    return {
      valid: true,
      discount: discountAmount,
      message: `Descuento de ${
        discount.type === "percentage"
          ? discount.value + "%"
          : "$" + discount.value.toLocaleString()
      } aplicado`,
    };
  }

  // Obtener historial de pedidos (simulado)
  async getOrderHistory(): Promise<OrderInfo[]> {
    // Simular llamada al backend
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Datos simulados
    return [
      {
        id: "TK-001-ABC123",
        items: [],
        shippingAddress: {
          name: "Juan Pérez",
          email: "juan@email.com",
          phone: "+57 300 123 4567",
          address: "Calle 123 #45-67",
          city: "Bogotá",
          postalCode: "110111",
          country: "Colombia",
        },
        paymentInfo: {
          method: "credit_card",
          cardholderName: "Juan Pérez",
        },
        subtotal: 450000,
        tax: 85500,
        shipping: 0,
        discount: 67500,
        total: 468000,
        status: "delivered",
        createdAt: "2024-01-15T10:30:00Z",
        estimatedDelivery: "2024-01-22",
        trackingNumber: "TK123456789",
      },
    ];
  }

  // Forzar actualización (para debugging)
  forceUpdate(): void {
    this.notifyListeners();
  }

  // Métodos de compatibilidad para componentes existentes
  getTotal(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.total;
  }

  getSubtotal(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.subtotal;
  }

  getShippingCost(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.shipping;
  }

  getTax(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.tax;
  }

  getTotalItems(): number {
    return this.getItemCount();
  }

  getItems(): CartItem[] {
    return this.getCartItems();
  }

  getTotalPrice(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.subtotal;
  }

  calculateShipping(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.shipping;
  }

  getTotalWithShipping(): number {
    const cartSummary = this.getCartSummary();
    return cartSummary.total;
  }

  removeItem(productId: number, size?: string, color?: string): void {
    this.removeFromCart(productId, size, color);
  }

  // Obtener productos recomendados basados en el carrito
  getRecommendedProducts(): Product[] {
    // Simular recomendaciones basadas en los productos en el carrito
    // const _categories = [
    //   ...new Set(this.cartItems.map((item) => item.product.tipoProductoId)),
    // ];

    // En una implementación real, esto vendría del backend
    return [];
  }

  // Calcular puntos de fidelidad ganados por la compra
  calculateLoyaltyPoints(total: number): number {
    // 1 punto por cada $1000 gastados
    return Math.floor(total / 1000);
  }

  // Validar disponibilidad de stock
  async validateStock(): Promise<{
    valid: boolean;
    unavailableItems: CartItem[];
  }> {
    try {
      // Validar stock con el backend
      const unavailableItems: CartItem[] = [];

      for (const item of this.cartItems) {
        const response = await fetch(
          `${this.baseUrl}/productos/${item.product.idProducto}/stock`
        );
        if (response.ok) {
          const stockData = await response.json();
          const availableStock = stockData.stock || 0;

          if (availableStock < item.quantity) {
            unavailableItems.push(item);
          }
        } else {
          // Fallback a validación local
          if (!item.product.stock || item.product.stock < item.quantity) {
            unavailableItems.push(item);
          }
        }
      }

      return {
        valid: unavailableItems.length === 0,
        unavailableItems,
      };
    } catch (error) {
      console.error("Error validating stock:", error);
      // Fallback a validación local
      const unavailableItems = this.cartItems.filter(
        (item) => !item.product.stock || item.product.stock < item.quantity
      );

      return {
        valid: unavailableItems.length === 0,
        unavailableItems,
      };
    }
  }
}

export const cartService = new CartService();