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
  method: "credit_card" | "paypal" | "cash_on_delivery";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  cardName?: string;
  transactionId?: string;
}

export interface OrderInfo {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  loyaltyPointsUsed?: number;
  notes?: string;
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
  private baseUrl = "https://backend-ecommerce-6vi3.onrender.com/api";

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
        this.cartItems = parsed.map((item: CartItem) => ({
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
    // Crear un ID único basado en idProducto + size + color + timestamp
    // Esto permite agregar el mismo producto múltiples veces como items separados
    const uniqueId = `${product.idProducto}-${size || 'default'}-${color || 'default'}-${Date.now()}`;
    
    // Siempre agregar como nuevo item (no agrupar)
    const price = product.precio || 0;
    const newItem: CartItem = {
      product: {
        ...product,
        // Agregar un ID único temporal para este item del carrito
        idProducto: parseInt(uniqueId.split('-')[0]) // Mantener el ID original del producto
      },
      quantity,
      size,
      color,
      price,
      total: price * quantity,
      addedAt: new Date(),
    };
    
    this.cartItems.push(newItem);

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
      // Enviar al backend y obtener los datos del pedido creado
      const backendOrderData = await this.sendOrderToBackend(order);

      // Limpiar carrito después del pedido exitoso
      this.clearCart();

      notificationService.showNotification(
        `Pedido #${backendOrderData.numeroPedido} procesado exitosamente`,
        "success"
      );

      // Retornar los datos del backend en lugar de los datos locales
      return backendOrderData;
    } catch (error) {
      console.error("Error processing order:", error);
      throw new Error("Error al procesar el pedido");
    }
  }

  // Enviar pedido al backend
  private async sendOrderToBackend(order: OrderInfo): Promise<any> {
    try {
      // Preparar los detalles del pedido en el formato esperado por el backend
      const detalles = order.items.map((item) => {
        const productoId = item.product.idProducto || item.product.id;
        console.log("=== DEBUG PRODUCTO ===");
        console.log("Producto completo:", item.product);
        console.log("idProducto:", item.product.idProducto);
        console.log("id:", item.product.id);
        console.log("Producto ID final:", productoId);
        console.log("=====================");

        if (!productoId) {
          throw new Error(
            `Producto sin ID válido: ${JSON.stringify(item.product)}`
          );
        }

        return {
          productoId: productoId,
          cantidad: item.quantity,
          precioUnitario: item.product.precio || 0,
          subtotal: (item.product.precio || 0) * item.quantity,
        };
      });

      // Calcular subtotal total
      // Los cálculos se harán directamente en el objeto pedidoData

      // Preparar la dirección de envío con coordenadas en formato correcto
      const direccionEnvio = {
        nombre: order.shippingAddress.name,
        email: order.shippingAddress.email,
        telefono: order.shippingAddress.phone,
        direccion: order.shippingAddress.address,
        ciudad: order.shippingAddress.city,
        codigoPostal: order.shippingAddress.postalCode,
        pais: order.shippingAddress.country,
        coordenadas: order.shippingAddress.coordinates
          ? {
              latitud: order.shippingAddress.coordinates.latitude,
              longitud: order.shippingAddress.coordinates.longitude,
            }
          : undefined,
      };

      // Preparar la información de pago
      const informacionPago: {
        metodo: string;
        numeroTarjeta?: string;
        nombreTitular?: string;
        fechaVencimiento?: string;
        codigoSeguridad?: string;
        transaccionId?: string;
      } = {
        metodo:
          order.paymentInfo.method === "credit_card"
            ? "debit_card"
            : order.paymentInfo.method || "cash_on_delivery",
      };

      // Solo agregar campos de tarjeta si el método es credit_card
      if (order.paymentInfo.method === "credit_card") {
        if (order.paymentInfo.cardNumber?.trim()) {
          informacionPago.numeroTarjeta = order.paymentInfo.cardNumber.trim();
        }
        if (order.paymentInfo.cardholderName?.trim()) {
          informacionPago.nombreTitular =
            order.paymentInfo.cardholderName.trim();
        }
        if (order.paymentInfo.expiryDate?.trim()) {
          informacionPago.fechaVencimiento =
            order.paymentInfo.expiryDate.trim();
        }
        if (order.paymentInfo.cvv?.trim()) {
          informacionPago.codigoSeguridad = order.paymentInfo.cvv.trim();
        }
      }

      // Agregar transactionId si existe
      if (order.paymentInfo.transactionId?.trim()) {
        informacionPago.transaccionId = order.paymentInfo.transactionId.trim();
      }

      const pedidoData: {
        numeroPedido: string;
        detalles: Array<{
          productoId: string | number;
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
          coordenadas?: { latitud: number; longitud: number };
        };
        informacionPago: {
          metodo: string;
          numeroTarjeta?: string;
          nombreTitular?: string;
          fechaVencimiento?: string;
          codigoSeguridad?: string;
          transaccionId?: string;
        };
        subtotal: number;
        impuestos: number;
        costoEnvio: number;
        descuento: number;
        total: number;
        estado: string;
        metodoEnvio: string;
        puntosFidelidadUsados: number;
        puntosFidelidadGanados: number;
        notas?: string;
        esInvitado: boolean;
      } = {
        numeroPedido: this.generateOrderId(),
        detalles,
        direccionEnvio,
        informacionPago,
        subtotal: detalles.reduce((sum, item) => sum + item.subtotal, 0),
        impuestos:
          detalles.reduce((sum, item) => sum + item.subtotal, 0) * 0.19,
        costoEnvio: order.shipping,
        descuento: order.discount,
        total:
          detalles.reduce((sum, item) => sum + item.subtotal, 0) +
          detalles.reduce((sum, item) => sum + item.subtotal, 0) * 0.19 +
          order.shipping -
          order.discount,
        estado: "pending",
        metodoEnvio: "standard",
        puntosFidelidadUsados: order.loyaltyPointsUsed || 0,
        puntosFidelidadGanados: Math.floor(
          detalles.reduce((sum, item) => sum + item.subtotal, 0) / 1000
        ),
        esInvitado: false, // Cambiar a false para usuarios logueados
      };

      // Obtener usuario actual para pedidos de usuarios registrados
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        (pedidoData as any).usuarioId = currentUser.uid; // Usar UID de Firebase como string
        pedidoData.esInvitado = false;
      } else {
        pedidoData.esInvitado = true;
      }

      // Solo agregar notas si no están vacías
      if (order.notes?.trim()) {
        pedidoData.notas = order.notes.trim();
      }

      // Log para debug
      console.log(
        "Datos del pedido que se envían al backend:",
        JSON.stringify(pedidoData, null, 2)
      );

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

      // Retornar los datos del pedido del backend
      return result.data;
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
    } catch {
      console.warn("No se pudo obtener token de autenticación");
      return {};
    }
  }

  // Método para obtener el usuario actual
  private async getCurrentUser(): Promise<any> {
    try {
      const { firebaseAuthService } = await import("./FirebaseAuthService");
      return firebaseAuthService.getCurrentUser();
    } catch (error) {
      console.warn("No se pudo obtener usuario actual:", error);
      return null;
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

  // Obtener historial de pedidos desde el backend
  async getOrderHistory(): Promise<OrderInfo[]> {
    try {
      // TODO: Implementar llamada real al backend
      // const response = await fetch(`${BASE_URL}/api/pedidos/historial`, {
      //   method: "GET",
      //   headers: await getAuthHeaders(),
      // });
      // const data = await response.json();
      // return data.success ? data.data : [];

      // Por ahora, retornar array vacío
      return [];
    } catch (error) {
      console.error("Error al obtener historial de pedidos:", error);
      return [];
    }
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