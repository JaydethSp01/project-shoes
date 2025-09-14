import { Product } from "../modelos/productTypes";

export interface DashboardStats {
  totalPurchases: number;
  totalSpent: number;
  loyaltyPoints: number;
  userLevel: string;
  nextLevelPoints: number;
  activeDiscount: string;
  favoriteCategories: string[];
  recentActivity: Activity[];
}

export interface Activity {
  id: number;
  type: "purchase" | "review" | "favorite" | "wishlist";
  description: string;
  date: string;
  productId?: number;
}

export interface Purchase {
  id: number;
  date: string;
  total: number;
  status: "delivered" | "shipped" | "pending" | "cancelled";
  products: Product[];
  tracking?: string;
  invoiceNumber: string;
}

export interface Favorite {
  id: number;
  productId: number;
  product: Product;
  dateAdded: string;
}

export interface Wishlist {
  id: number;
  name: string;
  description?: string;
  products: Product[];
  createdAt: string;
  isPublic: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "offer" | "order" | "new_product" | "loyalty" | "general";
  isRead: boolean;
  date: string;
  actionUrl?: string;
}

class DashboardService {
  private baseUrl = "http://localhost:8080";

  // Obtener estadísticas del dashboard
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // En una implementación real, esto vendría del backend
      // Por ahora simulamos datos
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        totalPurchases: 12,
        totalSpent: 2450000,
        loyaltyPoints: 150,
        userLevel: "Silver",
        nextLevelPoints: 350,
        activeDiscount: "15%",
        favoriteCategories: ["Sneakers", "Running", "Casual"],
        recentActivity: [
          {
            id: 1,
            type: "purchase",
            description: "Compra realizada: Nike Air Max",
            date: "2024-01-15",
            productId: 72,
          },
          {
            id: 2,
            type: "review",
            description: "Reseña publicada: Adidas Ultraboost",
            date: "2024-01-14",
            productId: 84,
          },
          {
            id: 3,
            type: "favorite",
            description: "Producto agregado a favoritos",
            date: "2024-01-13",
            productId: 91,
          },
        ],
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      throw error;
    }
  }

  // Obtener historial de compras
  async getPurchaseHistory(userId: string): Promise<Purchase[]> {
    try {
      // Simular llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 300));

      return [
        {
          id: 1,
          date: "2024-01-15",
          total: 450000,
          status: "delivered",
          products: [],
          tracking: "TK123456789",
          invoiceNumber: "INV-001-2024",
        },
        {
          id: 2,
          date: "2024-01-10",
          total: 320000,
          status: "shipped",
          products: [],
          tracking: "TK987654321",
          invoiceNumber: "INV-002-2024",
        },
        {
          id: 3,
          date: "2024-01-05",
          total: 180000,
          status: "delivered",
          products: [],
          tracking: "TK456789123",
          invoiceNumber: "INV-003-2024",
        },
      ];
    } catch (error) {
      console.error("Error obteniendo historial de compras:", error);
      throw error;
    }
  }

  // Obtener favoritos
  async getFavorites(userId: number): Promise<Favorite[]> {
    try {
      const response = await fetch(
        `http://localhost:8080/favoritos/usuario/${userId}`
      );
      if (!response.ok) {
        throw new Error("Error obteniendo favoritos");
      }
      const backendFavorites = await response.json();

      // Transformar los datos del backend al formato del frontend
      return backendFavorites.map((fav: any) => ({
        id: fav.id,
        productId: fav.productoId,
        product: {
          id: fav.productoId,
          nombre: fav.producto_nombre || `Producto #${fav.productoId}`,
          marca: fav.marca || "Marca desconocida",
          precio: fav.precio || 0,
          imagen: fav.imagen || "/placeholder-shoe.jpg",
        } as Product,
        dateAdded: fav.fechaAgregado || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error obteniendo favoritos:", error);
      // Fallback con datos simulados
      return [
        {
          id: 1,
          productId: 72,
          product: {
            id: 72,
            nombre: "Zapatos Deportivos Nike",
            marca: "Nike",
            precio: 150000,
            imagen: "/placeholder-shoe.jpg",
          } as Product,
          dateAdded: "2024-01-10",
        },
        {
          id: 2,
          productId: 84,
          product: {} as Product,
          dateAdded: "2024-01-08",
        },
      ];
    }
  }

  // Agregar a favoritos
  async addToFavorites(userId: number, productId: number): Promise<void> {
    try {
      const response = await fetch("http://localhost:8080/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: userId,
          productoId: productId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error agregando a favoritos");
      }
    } catch (error) {
      console.error("Error agregando a favoritos:", error);
      throw error;
    }
  }

  // Remover de favoritos
  async removeFromFavorites(userId: number, productId: number): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:8080/favoritos/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error removiendo de favoritos");
      }
    } catch (error) {
      console.error("Error removiendo de favoritos:", error);
      throw error;
    }
  }

  // Obtener listas de deseos
  async getWishlists(userId: number): Promise<Wishlist[]> {
    try {
      const response = await fetch(
        `http://localhost:8080/wishlists/usuario/${userId}`
      );
      if (!response.ok) {
        throw new Error("Error obteniendo listas de deseos");
      }
      const backendWishlists = await response.json();

      // Transformar los datos del backend al formato del frontend
      return backendWishlists.map((wishlist: any) => ({
        id: wishlist.id,
        name: wishlist.nombre,
        description: wishlist.descripcion || "",
        products: [], // Se cargarán por separado si es necesario
        createdAt: wishlist.fechaCreacion || new Date().toISOString(),
        isPublic: wishlist.isPublic || false,
      }));
    } catch (error) {
      console.error("Error obteniendo listas de deseos:", error);
      // Fallback con datos simulados
      return [
        {
          id: 1,
          name: "Zapatillas de Running",
          description: "Para mis entrenamientos",
          products: [],
          createdAt: "2024-01-10",
          isPublic: false,
        },
        {
          id: 2,
          name: "Calzado Formal",
          description: "Para eventos especiales",
          products: [],
          createdAt: "2024-01-08",
          isPublic: true,
        },
      ];
    }
  }

  // Crear lista de deseos
  async createWishlist(
    userId: number,
    name: string,
    description?: string
  ): Promise<Wishlist> {
    try {
      const response = await fetch("http://localhost:8080/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: userId,
          nombre: name,
          descripcion: description || "",
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error creando lista de deseos");
      }

      // Transformar la respuesta del backend al formato del frontend
      const backendWishlist = data.wishlist;
      return {
        id: backendWishlist.id,
        name: backendWishlist.nombre,
        description: backendWishlist.descripcion || "",
        products: [],
        createdAt: backendWishlist.fechaCreacion || new Date().toISOString(),
        isPublic: backendWishlist.isPublic || false,
      };
    } catch (error) {
      console.error("Error creando lista de deseos:", error);
      throw error;
    }
  }

  // Agregar producto a lista de deseos
  async addToWishlist(wishlistId: number, productId: number): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:8080/wishlists/${wishlistId}/productos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productoId: productId,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Error agregando producto a lista de deseos"
        );
      }
    } catch (error) {
      console.error("Error agregando producto a lista de deseos:", error);
      throw error;
    }
  }

  // Obtener notificaciones
  async getNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await fetch(
        `http://localhost:8080/notificaciones/usuario/${userId}`
      );
      if (!response.ok) {
        throw new Error("Error obteniendo notificaciones");
      }
      const backendNotifications = await response.json();

      // Transformar los datos del backend al formato del frontend
      return backendNotifications.map((notification: any) => ({
        id: notification.id,
        title: notification.titulo,
        message: notification.mensaje,
        type: notification.tipo || "info",
        isRead: notification.leida || false,
        date: notification.fechaCreacion || new Date().toISOString(),
        actionUrl: notification.urlAccion || null,
      }));
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
      // Fallback con datos simulados
      return [
        {
          id: 1,
          title: "¡Nueva oferta disponible!",
          message: "20% de descuento en zapatillas Nike",
          type: "offer",
          isRead: false,
          date: "2024-01-16",
          actionUrl: "/ofertas",
        },
        {
          id: 2,
          title: "Tu pedido ha sido enviado",
          message: "Tu pedido #TK987654321 está en camino",
          type: "order",
          isRead: true,
          date: "2024-01-14",
          actionUrl: "/pedidos",
        },
        {
          id: 3,
          title: "Nuevo producto disponible",
          message: "Adidas Ultraboost 22 ya está disponible",
          type: "new_product",
          isRead: false,
          date: "2024-01-13",
          actionUrl: "/productos/84",
        },
      ];
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:8080/notificaciones/${notificationId}/marcar-leida`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Error marcando notificación como leída"
        );
      }
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
      throw error;
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(
    userId: string,
    profileData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Error actualizando perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/usuarios/${userId}/cambiar-contraseña`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contraseña_actual: currentPassword,
            nueva_contraseña: newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error cambiando contraseña");
      }
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      throw error;
    }
  }

  // Obtener puntos de fidelidad
  async getLoyaltyPoints(userId: string): Promise<{
    currentPoints: number;
    level: string;
    nextLevelPoints: number;
    transactions: Array<{
      id: number;
      type: "earned" | "redeemed";
      points: number;
      description: string;
      date: string;
    }>;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/puntos-fidelidad/usuario/${userId}`
      );
      if (!response.ok) {
        throw new Error("Error obteniendo puntos de fidelidad");
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo puntos de fidelidad:", error);
      // Fallback con datos simulados
      return {
        currentPoints: 150,
        level: "Silver",
        nextLevelPoints: 350,
        transactions: [
          {
            id: 1,
            type: "earned",
            points: 50,
            description: "Puntos de bienvenida",
            date: "2024-01-01",
          },
          {
            id: 2,
            type: "earned",
            points: 100,
            description: "Compra: Nike Air Max",
            date: "2024-01-15",
          },
        ],
      };
    }
  }

  // Canjear puntos por descuento
  async redeemPoints(
    userId: string,
    points: number
  ): Promise<{
    discountCode: string;
    discountAmount: number;
    remainingPoints: number;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/puntos-fidelidad/usuario/${userId}/canjear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            puntos: points,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error canjeando puntos");
      }

      return await response.json();
    } catch (error) {
      console.error("Error canjeando puntos:", error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
