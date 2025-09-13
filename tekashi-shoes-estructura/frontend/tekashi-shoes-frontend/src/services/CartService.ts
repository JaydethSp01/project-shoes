import { Product } from "../modelos/productTypes";
import { notificationService } from "./NotificationService";

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

class CartService {
  private cartItems: CartItem[] = [];
  private listeners: ((items: CartItem[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Suscribirse a cambios en el carrito
  subscribe(listener: (items: CartItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notificar a todos los listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.cartItems]));
    this.saveToStorage();
  }

  // Obtener todos los items del carrito
  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener precio total
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0
    );
  }

  // Agregar producto al carrito
  addItem(product: Product, quantity: number = 1): boolean {
    if (product.stock === 0) {
      notificationService.addNotification({
        type: "error",
        title: "Producto agotado",
        message: `${product.marca} no está disponible en este momento`,
      });
      return false;
    }

    const existingItem = this.cartItems.find(
      (item) => item.product.idProducto === product.idProducto
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        notificationService.addNotification({
          type: "warning",
          title: "Stock insuficiente",
          message: `Solo hay ${product.stock} unidades disponibles de ${product.marca}`,
        });
        return false;
      }
      existingItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        notificationService.addNotification({
          type: "warning",
          title: "Stock insuficiente",
          message: `Solo hay ${product.stock} unidades disponibles de ${product.marca}`,
        });
        return false;
      }
      this.cartItems.push({
        product,
        quantity,
        addedAt: new Date(),
      });
    }

    this.notifyListeners();
    notificationService.addToCartNotification(product.marca, quantity);
    return true;
  }

  // Remover producto del carrito
  removeItem(productId: number): boolean {
    const itemIndex = this.cartItems.findIndex(
      (item) => item.product.idProducto === productId
    );

    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];
      this.cartItems.splice(itemIndex, 1);
      this.notifyListeners();
      notificationService.removeFromCartNotification(item.product.marca);
      return true;
    }
    return false;
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: number, quantity: number): boolean {
    const item = this.cartItems.find(
      (item) => item.product.idProducto === productId
    );

    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }

      if (quantity > item.product.stock) {
        notificationService.addNotification({
          type: "warning",
          title: "Stock insuficiente",
          message: `Solo hay ${item.product.stock} unidades disponibles de ${item.product.marca}`,
        });
        return false;
      }

      item.quantity = quantity;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartItems = [];
    this.notifyListeners();
    notificationService.addNotification({
      type: "info",
      title: "Carrito vaciado",
      message: "Se han eliminado todos los productos del carrito",
    });
  }

  // Verificar si un producto está en el carrito
  isInCart(productId: number): boolean {
    return this.cartItems.some((item) => item.product.idProducto === productId);
  }

  // Obtener cantidad de un producto específico en el carrito
  getItemQuantity(productId: number): number {
    const item = this.cartItems.find(
      (item) => item.product.idProducto === productId
    );
    return item ? item.quantity : 0;
  }

  // Simular proceso de checkout
  async checkout(): Promise<boolean> {
    if (this.cartItems.length === 0) {
      notificationService.addNotification({
        type: "warning",
        title: "Carrito vacío",
        message: "Agrega productos al carrito antes de proceder al checkout",
      });
      return false;
    }

    // Simular procesamiento
    notificationService.addNotification({
      type: "info",
      title: "Procesando pedido...",
      message: "Tu pedido está siendo procesado",
    });

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular éxito
    const totalItems = this.getTotalItems();
    const totalPrice = this.getTotalPrice();

    notificationService.addNotification({
      type: "success",
      title: "¡Pedido confirmado!",
      message: `Se ha procesado tu pedido de ${totalItems} productos por $${totalPrice.toLocaleString()}`,
    });

    // Limpiar carrito después del checkout
    this.clearCart();
    return true;
  }

  // Guardar en localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem("tekashi_cart", JSON.stringify(this.cartItems));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }

  // Cargar desde localStorage
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem("tekashi_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.cartItems = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
      this.cartItems = [];
    }
  }

  // Obtener resumen del carrito
  getSummary() {
    return {
      totalItems: this.getTotalItems(),
      totalPrice: this.getTotalPrice(),
      itemCount: this.cartItems.length,
      isEmpty: this.cartItems.length === 0,
    };
  }

  // Aplicar descuento (simulado)
  applyDiscount(percentage: number): number {
    const total = this.getTotalPrice();
    const discount = total * (percentage / 100);
    return Math.max(0, total - discount);
  }

  // Calcular envío (simulado)
  calculateShipping(): number {
    const total = this.getTotalPrice();
    if (total >= 200000) {
      return 0; // Envío gratis
    }
    return 15000; // Costo de envío
  }

  // Obtener total con envío
  getTotalWithShipping(): number {
    return this.getTotalPrice() + this.calculateShipping();
  }

  // Forzar actualización del contador (para arreglar cache)
  forceUpdate(): void {
    this.notifyListeners();
  }

  // Limpiar cache y recargar
  clearCache(): void {
    localStorage.removeItem("tekashi_cart");
    this.cartItems = [];
    this.notifyListeners();
  }
}

export const cartService = new CartService();
