import { Imagen, Product } from "../modelos/productTypes";
import { firebaseAuthService } from "./FirebaseAuthService";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://project-shoes.onrender.com/api";

// Función para obtener headers con autenticación
const getAuthHeaders = async () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const token = await firebaseAuthService.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    // Si no hay token, continuar sin autenticación
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

    const url = queryParams.toString()
      ? `${BASE_URL}/producto?${queryParams.toString()}`
      : `${BASE_URL}/producto`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const data = await response.json();
    return data.success ? data.data : data;
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
      ? `${BASE_URL}/producto/tipo/${tipoProductoId}?${queryParams.toString()}`
      : `${BASE_URL}/producto/tipo/${tipoProductoId}`;

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
    const response = await fetch(`${BASE_URL}/producto`, {
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
    const response = await fetch(`${BASE_URL}/producto/${id}`, {
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
    const response = await fetch(`${BASE_URL}/producto/${id}`, {
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
      ? `${BASE_URL}/tipo_producto?${queryParams.toString()}`
      : `${BASE_URL}/tipo_producto`;

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
      `${BASE_URL}/imagenes/tipo-producto/${tipoProductoId}`,
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
      ? `${BASE_URL}/imagenes?${queryParams.toString()}`
      : `${BASE_URL}/imagenes`;

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
    const response = await fetch(`${BASE_URL}/imagenes/${id}`, {
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
    const response = await fetch(`${BASE_URL}/imagenes`, {
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
    const response = await fetch(`${BASE_URL}/imagenes/${id}`, {
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
      ? `${BASE_URL}/favoritos?${queryParams.toString()}`
      : `${BASE_URL}/favoritos`;

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
    const response = await fetch(`${BASE_URL}/favoritos`, {
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
    const response = await fetch(`${BASE_URL}/favoritos/${productoId}`, {
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
      `${BASE_URL}/favoritos/verificar/${productoId}`,
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
      ? `${BASE_URL}/wishlists?${queryParams.toString()}`
      : `${BASE_URL}/wishlists`;

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
    const response = await fetch(`${BASE_URL}/wishlists`, {
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
      `${BASE_URL}/wishlists/${wishlistId}/productos`,
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
      ? `${BASE_URL}/notificaciones?${queryParams.toString()}`
      : `${BASE_URL}/notificaciones`;

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
      `${BASE_URL}/notificaciones/${notificacionId}/leer`,
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
};
