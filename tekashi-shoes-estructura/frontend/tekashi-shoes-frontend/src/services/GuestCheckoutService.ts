export interface GuestUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface GuestOrder {
  id: string;
  guestInfo: GuestUser;
  items: Array<{
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shipping: number;
  finalTotal: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}

class GuestCheckoutService {
  private orders: GuestOrder[] = [];
  private listeners: Array<(orders: GuestOrder[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  // Suscribirse a cambios en las órdenes
  subscribe(listener: (orders: GuestOrder[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notificar a todos los listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.orders]));
    this.saveToStorage();
  }

  // Crear orden de invitado
  async createGuestOrder(
    guestInfo: GuestUser,
    cartItems: Array<{
      product: { idProducto: number; marca: string; precio: number };
      quantity: number;
    }>,
    paymentMethod: string
  ): Promise<GuestOrder> {
    const orderId = `GUEST-${Date.now()}`;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.precio * item.quantity,
      0
    );
    const shipping = subtotal >= 200000 ? 0 : 15000;
    const finalTotal = subtotal + shipping;

    const newOrder: GuestOrder = {
      id: orderId,
      guestInfo,
      items: cartItems.map((item) => ({
        productId: item.product.idProducto,
        productName: item.product.marca,
        price: item.product.precio,
        quantity: item.quantity,
      })),
      total: subtotal,
      shipping,
      finalTotal,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
    };

    this.orders.push(newOrder);
    this.notifyListeners();

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Actualizar estado a confirmado
    newOrder.status = "confirmed";
    this.notifyListeners();

    return newOrder;
  }

  // Obtener todas las órdenes
  getOrders(): GuestOrder[] {
    return [...this.orders];
  }

  // Obtener estadísticas
  getStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce(
      (sum, order) => sum + order.finalTotal,
      0
    );
    const pendingOrders = this.orders.filter(
      (order) => order.status === "pending"
    ).length;
    const completedOrders = this.orders.filter(
      (order) => order.status === "delivered"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }

  // Obtener órdenes por estado
  getOrdersByStatus(status: GuestOrder["status"]): GuestOrder[] {
    return this.orders.filter((order) => order.status === status);
  }

  // Actualizar estado de orden
  updateOrderStatus(orderId: string, status: GuestOrder["status"]): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Obtener órdenes por rango de fechas
  getOrdersByDateRange(startDate: Date, endDate: Date): GuestOrder[] {
    return this.orders.filter(
      (order) => order.createdAt >= startDate && order.createdAt <= endDate
    );
  }

  // Obtener productos más vendidos
  getTopProducts(limit: number = 10) {
    const productSales: {
      [key: number]: { name: string; quantity: number; revenue: number };
    } = {};

    this.orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({
        productId: parseInt(id),
        ...data,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }

  // Guardar en localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem("tekashi_guest_orders", JSON.stringify(this.orders));
    } catch (error) {
      console.error("Error guardando órdenes:", error);
    }
  }

  // Cargar desde localStorage
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem("tekashi_guest_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.orders = parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }));
      }
    } catch (error) {
      console.error("Error cargando órdenes:", error);
      this.orders = [];
    }
  }

  // Limpiar datos (para testing)
  clearData(): void {
    this.orders = [];
    localStorage.removeItem("tekashi_guest_orders");
    this.notifyListeners();
  }
}

export const guestCheckoutService = new GuestCheckoutService();
