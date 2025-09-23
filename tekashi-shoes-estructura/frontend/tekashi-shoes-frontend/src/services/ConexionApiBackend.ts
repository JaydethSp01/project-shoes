import { Imagen, Product } from "../modelos/productTypes";
import { unifiedAuthService } from "./UnifiedAuthService";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-ecommerce-6vi3.onrender.com";

// Función para obtener headers con autenticación
const getAuthHeaders = async () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const token = await unifiedAuthService.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("No se pudo obtener token de autenticación");
  }
  return headers;
};

export const ConexionApiBackend = {
  // Obtener lista de productos
  obtenerProductos: async (params?: {
    pagina?: number;
    limite?: number;
    tipoProductoId?: string;
    genero?: string;
    marca?: string;
    precioMin?: number;
    precioMax?: number;
    destacado?: boolean;
    oferta?: boolean;
    busqueda?: string;
    ordenar?: string;
    direccion?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    try {
      const url = queryParams.toString()
        ? `${BASE_URL}/api/producto?${queryParams.toString()}`
        : `${BASE_URL}/api/producto`;

      const response = await fetch(url, {
        method: "GET",
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error; // Re-lanzar el error para que el componente maneje el loading
    }
  },

  // Obtener productos por tipo de producto
  obtenerProductosPorTipo: async (
    tipoProductoId: string,
    params?: {
      pagina?: number;
      limite?: number;
    }
  ) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/producto/tipo/${tipoProductoId}?${queryParams.toString()}`
      : `${BASE_URL}/api/producto/tipo/${tipoProductoId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos por tipo de producto");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Crear un nuevo producto
  agregarProducto: async (producto: Product) => {
    const response = await fetch(`${BASE_URL}/api/producto`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error("Error al agregar producto");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Actualizar producto existente
  actualizarProducto: async (id: string, producto: any) => {
    const response = await fetch(`${BASE_URL}/api/producto/${id}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar producto");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Eliminar un producto
  eliminarProducto: async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/producto/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al eliminar producto");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Obtener lista de tipos de producto
  obtenerTiposProducto: async (activo?: boolean) => {
    const queryParams = new URLSearchParams();
    if (activo !== undefined) {
      queryParams.append("activo", activo.toString());
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/tipo_producto?${queryParams.toString()}`
      : `${BASE_URL}/api/tipo_producto`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener tipos de producto");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Obtener imagen por tipo de producto
  obtenerImagenPorTipoProducto: async (tipoProductoId: string) => {
    const response = await fetch(
      `${BASE_URL}/api/imagenes/tipo-producto/${tipoProductoId}`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener imagen por tipo de producto");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Obtener lista de imágenes
  obtenerImagenes: async (params?: {
    pagina?: number;
    limite?: number;
    tipoProductoId?: string;
    productoId?: string;
    tipo?: string;
    activa?: boolean;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/imagenes?${queryParams.toString()}`
      : `${BASE_URL}/api/imagenes`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener imágenes");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Obtener imagen por ID
  obtenerImagenPorId: async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/imagenes/${id}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener imagen");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Crear nueva imagen
  agregarImagen: async (imagen: Imagen) => {
    const response = await fetch(`${BASE_URL}/api/imagenes`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(imagen),
    });
    if (!response.ok) {
      throw new Error("Error al agregar imagen");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Eliminar una imagen
  eliminarImagen: async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/imagenes/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al eliminar imagen");
    }
    const data = await response.json();
    return data.success ? data.data : data;
  },

  // ========== MÉTODOS PARA FAVORITOS ==========

  // Obtener favoritos del usuario autenticado
  obtenerFavoritosUsuario: async (params?: {
    pagina?: number;
    limite?: number;
    ordenar?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/favoritos?${queryParams.toString()}`
      : `${BASE_URL}/api/favoritos`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener favoritos del usuario");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Agregar producto a favoritos
  agregarAFavoritos: async (
    productoId: string,
    datosAdicionales?: {
      notas?: string;
      prioridad?: number;
      notificarOferta?: boolean;
      notificarStock?: boolean;
    }
  ) => {
    const response = await fetch(`${BASE_URL}/api/favoritos`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        productoId: productoId,
        ...datosAdicionales,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar producto a favoritos");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al agregar a favoritos");
    }

    return data;
  },

  // Remover producto de favoritos
  removerDeFavoritos: async (productoId: string) => {
    const response = await fetch(`${BASE_URL}/api/favoritos/${productoId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al remover producto de favoritos");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al remover de favoritos");
    }

    return data;
  },

  // Verificar si un producto está en favoritos
  verificarFavorito: async (productoId: string) => {
    const response = await fetch(
      `${BASE_URL}/api/favoritos/verificar/${productoId}`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success ? data.data.enFavoritos : false;
  },

  // ========== MÉTODOS PARA WISHLISTS ==========

  // Obtener wishlists del usuario autenticado
  obtenerWishlistsUsuario: async (params?: {
    pagina?: number;
    limite?: number;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/wishlists?${queryParams.toString()}`
      : `${BASE_URL}/api/wishlists`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener wishlists del usuario");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Crear nueva wishlist
  crearWishlist: async (datos: {
    nombre: string;
    descripcion?: string;
    publica?: boolean;
    notificaciones?: {
      ofertas?: boolean;
      stock?: boolean;
      nuevosProductos?: boolean;
    };
  }) => {
    const response = await fetch(`${BASE_URL}/api/wishlists`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error("Error al crear wishlist");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al crear wishlist");
    }

    return data;
  },

  // Agregar producto a wishlist
  agregarProductoAWishlist: async (
    wishlistId: string,
    productoId: string,
    datosAdicionales?: {
      notas?: string;
      prioridad?: number;
      cantidad?: number;
    }
  ) => {
    const response = await fetch(
      `${BASE_URL}/api/wishlists/${wishlistId}/productos`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          productoId: productoId,
          ...datosAdicionales,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al agregar producto a wishlist");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al agregar producto a wishlist");
    }

    return data;
  },

  // ========== MÉTODOS PARA NOTIFICACIONES ==========

  // Obtener notificaciones del usuario autenticado
  obtenerNotificacionesUsuario: async (params?: {
    pagina?: number;
    limite?: number;
    soloNoLeidas?: boolean;
    tipo?: string;
    categoria?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/notificaciones?${queryParams.toString()}`
      : `${BASE_URL}/api/notificaciones`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener notificaciones del usuario");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  },

  // Marcar notificación como leída
  marcarNotificacionLeida: async (notificacionId: string) => {
    const response = await fetch(
      `${BASE_URL}/api/notificaciones/${notificacionId}/leer`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al marcar notificación como leída");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error al marcar notificación como leída");
    }

    return data;
  },

  // ========== MÉTODOS PARA REVIEWS ==========

  // Obtener reviews de un producto
  obtenerReviewsProducto: async (
    productoId: string,
    params?: {
      pagina?: number;
      limite?: number;
      ordenar?: string;
      direccion?: string;
      calificacion?: number;
      verificadas?: boolean;
    }
  ) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/reviews/producto/${productoId}?${queryParams.toString()}`
      : `${BASE_URL}/api/reviews/producto/${productoId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Si es 401, retornar array vacío para modo invitado
        if (response.status === 401) {
          console.warn("Reviews no disponibles en modo invitado");
          return { reviews: [], total: 0, pagina: 1, limite: 50 };
        }
        throw new Error("Error al obtener reviews del producto");
      }

      const data = await response.json();
      return data.success ? data.data : data;
    } catch (error) {
      console.warn("Error al cargar reviews:", error);
      // Retornar datos vacíos en caso de error para modo invitado
      return { reviews: [], total: 0, pagina: 1, limite: 50 };
    }
  },

  // Obtener estadísticas de reviews de un producto
  obtenerEstadisticasReviewsProducto: async (productoId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/reviews/producto/${productoId}/estadisticas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Si es 401, retornar estadísticas vacías para modo invitado
        if (response.status === 401) {
          console.warn(
            "Estadísticas de reviews no disponibles en modo invitado"
          );
          return {
            promedio: 0,
            total: 0,
            distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
        }
        throw new Error("Error al obtener estadísticas de reviews");
      }

      const data = await response.json();
      return data.success ? data.data : data;
    } catch (error) {
      console.warn("Error al cargar estadísticas de reviews:", error);
      // Retornar estadísticas vacías en caso de error para modo invitado
      return {
        promedio: 0,
        total: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
  },

  // Crear una nueva review
  crearReview: async (reviewData: {
    productoId: string;
    nombreUsuario: string;
    emailUsuario: string;
    calificacion: number;
    titulo?: string;
    comentario: string;
  }) => {
    const response = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear review");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Error al crear review");
    }

    return data;
  },

  // Actualizar una review
  actualizarReview: async (
    reviewId: string,
    reviewData: {
      calificacion?: number;
      titulo?: string;
      comentario?: string;
    }
  ) => {
    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar review");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Error al actualizar review");
    }

    return data;
  },

  // Eliminar una review
  eliminarReview: async (reviewId: string) => {
    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar review");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Error al eliminar review");
    }

    return data;
  },

  // Marcar review como útil o no útil
  marcarReviewUtil: async (reviewId: string, esUtil: boolean) => {
    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}/util`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ esUtil }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al marcar review");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Error al marcar review");
    }

    return data;
  },

  // Reportar una review
  reportarReview: async (reviewId: string, motivo: string) => {
    const response = await fetch(
      `${BASE_URL}/api/reviews/${reviewId}/reportar`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ motivo }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al reportar review");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Error al reportar review");
    }

    return data;
  },

  // Obtener reviews de un usuario
  obtenerReviewsUsuario: async (
    usuarioId: string,
    params?: {
      pagina?: number;
      limite?: number;
    }
  ) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${BASE_URL}/api/reviews/usuario/${usuarioId}?${queryParams.toString()}`
      : `${BASE_URL}/api/reviews/usuario/${usuarioId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener reviews del usuario");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  },
};
