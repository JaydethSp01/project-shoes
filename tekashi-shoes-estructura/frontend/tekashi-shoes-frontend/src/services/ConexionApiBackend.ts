import { Imagen, Product } from "../modelos/productTypes";

const BASE_URL = "http://localhost:8080";

export const ConexionApiBackend = {
  // Obtener lista de productos
  obtenerProductos: async () => {
    const response = await fetch(`${BASE_URL}/producto`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    return await response.json();
  },

  // Obtener productos por tipo de producto
  obtenerProductosPorTipo: async (tipoProductoId: number) => {
    const response = await fetch(
      `${BASE_URL}/producto/tipoProductoId=${tipoProductoId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener productos por tipo de producto");
    }
    return await response.json();
  },

  // Crear un nuevo producto
  agregarProducto: async (producto: Product) => {
    const response = await fetch(`${BASE_URL}/producto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error("Error al agregar producto");
    }
    return await response.json();
  },

  // Actualizar producto existente
  actualizarProducto: async (id: number, producto: any) => {
    const response = await fetch(`${BASE_URL}/producto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar producto");
    }
    return await response.json();
  },

  // Eliminar un producto
  eliminarProducto: async (id: number) => {
    const response = await fetch(`${BASE_URL}/producto/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar producto");
    }
  },

  // Obtener lista de tipos de producto
  obtenerTiposProducto: async () => {
    const response = await fetch(`${BASE_URL}/tipo_producto`);
    if (!response.ok) {
      throw new Error("Error al obtener tipos de producto");
    }
    return await response.json();
  },

  // Obtener imagen por tipo de producto
  obtenerImagenPorTipoProducto: async (tipoProductoId: number) => {
    const response = await fetch(
      `${BASE_URL}/imagenes/porTipoProducto?tipoProductoId=${tipoProductoId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener imagen por tipo de producto");
    }
    return await response.json();
  },

  // Obtener lista de imágenes
  obtenerImagenes: async (id: number) => {
    const response = await fetch(`${BASE_URL}/imagenes/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener imágenes");
    }
    return await response.json();
  },

  // Crear nueva imagen
  agregarImagen: async (imagen: Imagen) => {
    const response = await fetch(`${BASE_URL}/imagenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imagen),
    });
    if (!response.ok) {
      throw new Error("Error al agregar imagen");
    }
    return await response.json();
  },

  // Eliminar una imagen
  eliminarImagen: async (id: number) => {
    const response = await fetch(`${BASE_URL}/imagenes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar imagen");
    }
  },
};
