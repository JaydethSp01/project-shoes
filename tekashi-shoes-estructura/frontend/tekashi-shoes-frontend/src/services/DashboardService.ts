import { Product } from "../modelos/productTypes";

// Helper function to get base URL
const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

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
  private baseUrl = `${getBaseUrl()}/api`;

  // Obtener token de autenticación
  private async getAuthToken(): Promise<string | null> {
    try {
      console.log("🔐 Obteniendo token de autenticación...");
      // Intentar obtener token de Firebase
      const { auth } = await import("../config/firebase");
      const user = auth.currentUser;
      console.log("👤 Usuario actual:", user ? "Autenticado" : "No autenticado");
      
      if (user) {
        const token = await user.getIdToken();
        console.log("🎫 Token obtenido:", token ? "Sí" : "No");
        console.log("🎫 Token (primeros 20 chars):", token ? token.substring(0, 20) + "..." : "null");
        return token;
      }
      console.warn("❌ No hay usuario autenticado");
      return null;
    } catch (error) {
      console.error("❌ Error obteniendo token de autenticación:", error);
      return null;
    }
  }

  // Obtener estadísticas del dashboard
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log("🔐 Enviando petición con token de autenticación");
        console.log("🔐 Token completo (primeros 50 chars):", token.substring(0, 50) + "...");
      } else {
        console.warn("⚠️ Enviando petición SIN token de autenticación");
      }

      console.log("📡 Headers enviados:", headers);
      console.log("🌐 URL:", `${this.baseUrl}/dashboard/stats/${userId}`);

      const response = await fetch(
        `${this.baseUrl}/dashboard/stats/${userId}`,
        {
          method: "GET",
          headers,
        }
      );

      console.log("📡 Respuesta del servidor:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        return {
          totalPurchases: data.totalPurchases || 0,
          totalSpent: data.totalSpent || 0,
          loyaltyPoints: data.loyaltyPoints || 0,
          userLevel: data.userLevel || "Bronze",
          nextLevelPoints: data.nextLevelPoints || 100,
          activeDiscount: data.activeDiscount || "5%",
          favoriteCategories: data.favoriteCategories || [],
          recentActivity: data.recentActivity || [],
        };
      } else {
        throw new Error("Error al obtener estadísticas del dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Retornar datos vacíos en caso de error
      return {
        totalPurchases: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        userLevel: "Bronze",
        nextLevelPoints: 100,
        activeDiscount: "0%",
        favoriteCategories: [],
        recentActivity: [],
      };
    }
  }

  // Obtener historial de compras
  async getPurchaseHistory(userId: string): Promise<Purchase[]> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${this.baseUrl}/dashboard/purchases/${userId}`,
        {
          method: "GET",
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.map((purchase: any) => ({
          id: purchase.id,
          date: purchase.date,
          total: purchase.total,
          status: purchase.status,
          products: purchase.products || [],
          tracking: purchase.tracking,
          invoiceNumber: purchase.invoiceNumber,
        }));
      } else {
        throw new Error("Error al obtener historial de compras");
      }
    } catch (error) {
      console.error("Error obteniendo historial de compras:", error);
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Obtener favoritos
  async getFavorites(userId: string): Promise<Favorite[]> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${getBaseUrl()}/api/favoritos/usuario/${userId}`,
        {
          method: "GET",
          headers,
        }
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
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Agregar a favoritos
  async addToFavorites(userId: string, productId: number): Promise<void> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/favoritos`, {
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
  async removeFromFavorites(userId: string, productId: number): Promise<void> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/favoritos/${userId}/${productId}`,
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
  async getWishlists(userId: string): Promise<Wishlist[]> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${getBaseUrl()}/api/wishlists/usuario/${userId}`,
        {
          method: "GET",
          headers,
        }
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
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Crear lista de deseos
  async createWishlist(
    userId: string,
    name: string,
    description?: string
  ): Promise<Wishlist> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/wishlists`, {
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
        `${getBaseUrl()}/api/wishlists/${wishlistId}/productos`,
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
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${getBaseUrl()}/api/notificaciones/usuario/${userId}`,
        {
          method: "GET",
          headers,
        }
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
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/notificaciones/${notificationId}/marcar-leida`,
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
      // Retornar datos vacíos en caso de error
      return {
        currentPoints: 0,
        level: "Bronze",
        nextLevelPoints: 100,
        transactions: [],
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
