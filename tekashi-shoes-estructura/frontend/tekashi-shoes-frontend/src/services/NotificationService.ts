import { ConexionApiBackend } from "./ConexionApiBackend";

export interface Notification {
  id: string;
  type:
    | "success"
    | "warning"
    | "error"
    | "info"
    | "promocion"
    | "stock"
    | "envio"
    | "review";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  productId?: number;
  userId?: number;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.startRealTimeNotifications();
  }

  // Suscribirse a cambios en las notificaciones
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notificar a todos los listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  // Obtener todas las notificaciones
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Obtener notificaciones no leídas
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  // Marcar como leída
  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Marcar todas como leídas
  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notifyListeners();
  }

  // Eliminar notificación
  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  // Limpiar todas las notificaciones
  clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Agregar notificación
  addNotification(
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);

    // Mantener máximo 50 notificaciones
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();
    return newNotification;
  }

  // Notificaciones en tiempo real basadas en eventos del backend
  private startRealTimeNotifications() {
    // Simular eventos de e-commerce en tiempo real
    setInterval(() => {
      this.generateRealTimeNotification();
    }, 30000); // Cada 30 segundos

    // Simular eventos de stock
    setInterval(() => {
      this.checkStockAlerts();
    }, 60000); // Cada minuto

    // Simular eventos de promociones
    setInterval(() => {
      this.generatePromotionNotification();
    }, 120000); // Cada 2 minutos
  }

  private async generateRealTimeNotification() {
    try {
      // Obtener productos del backend
      const products = await ConexionApiBackend.obtenerProductos();

      if (products.length > 0) {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];

        const events = [
          {
            type: "success" as const,
            title: "¡Nuevo producto disponible!",
            message: `${randomProduct.marca} en color ${randomProduct.color} ya está disponible`,
            productId: randomProduct.idProducto,
          },
          {
            type: "info" as const,
            title: "Producto popular",
            message: `${randomProduct.marca} es uno de nuestros productos más vendidos`,
            productId: randomProduct.idProducto,
          },
          {
            type: "promocion" as const,
            title: "¡Oferta especial!",
            message: `Descuento del 15% en ${randomProduct.marca} por tiempo limitado`,
            productId: randomProduct.idProducto,
          },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.addNotification(randomEvent);
      }
    } catch (error) {
      console.error("Error generando notificación:", error);
    }
  }

  private async checkStockAlerts() {
    try {
      const products = await ConexionApiBackend.obtenerProductos();
      const lowStockProducts = products.filter(
        (p: any) => p.stock > 0 && p.stock <= 5
      );

      if (lowStockProducts.length > 0 && Math.random() < 0.3) {
        const product =
          lowStockProducts[Math.floor(Math.random() * lowStockProducts.length)];
        this.addNotification({
          type: "warning",
          title: "Stock limitado",
          message: `Solo quedan ${product.stock} unidades de ${product.marca}`,
          productId: product.idProducto,
        });
      }
    } catch (error) {
      console.error("Error verificando stock:", error);
    }
  }

  private generatePromotionNotification() {
    const promotions = [
      {
        type: "promocion" as const,
        title: "¡Envío gratis!",
        message: "Envío gratuito en compras superiores a $200.000",
      },
      {
        type: "promocion" as const,
        title: "¡Descuento especial!",
        message: "20% de descuento en toda la colección de tenis",
      },
      {
        type: "info" as const,
        title: "Nueva colección",
        message: "Descubre nuestra nueva línea de zapatos de verano 2025",
      },
      {
        type: "success" as const,
        title: "¡Gracias por tu compra!",
        message: "Tu pedido ha sido procesado y será enviado pronto",
      },
    ];

    if (Math.random() < 0.4) {
      const promotion =
        promotions[Math.floor(Math.random() * promotions.length)];
      this.addNotification(promotion);
    }
  }

  // Notificaciones específicas para acciones del usuario
  addToCartNotification(productName: string, quantity: number) {
    this.addNotification({
      type: "success",
      title: "Agregado al carrito",
      message: `${quantity}x ${productName} agregado al carrito`,
    });
  }

  removeFromCartNotification(productName: string) {
    this.addNotification({
      type: "info",
      title: "Eliminado del carrito",
      message: `${productName} eliminado del carrito`,
    });
  }

  favoriteNotification(productName: string, isAdded: boolean) {
    this.addNotification({
      type: "success",
      title: isAdded ? "Agregado a favoritos" : "Eliminado de favoritos",
      message: `${productName} ${
        isAdded ? "agregado a" : "eliminado de"
      } tus favoritos`,
    });
  }

  searchNotification(searchTerm: string, resultsCount: number) {
    this.addNotification({
      type: "info",
      title: "Búsqueda completada",
      message: `Se encontraron ${resultsCount} productos para "${searchTerm}"`,
    });
  }

  showNotification(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) {
    this.addNotification({
      type,
      title:
        type === "success"
          ? "Éxito"
          : type === "error"
          ? "Error"
          : type === "warning"
          ? "Advertencia"
          : "Información",
      message,
    });
  }
}

// Instancia singleton
export const notificationService = new NotificationService();
