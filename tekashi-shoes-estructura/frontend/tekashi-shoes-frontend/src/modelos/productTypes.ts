export interface Product {
  idProducto: number;
  tipoProductoId: number;
  marca: string;
  color: string;
  precio: number;
  stock: number;
  imagenId: number;
}

export interface TipoProducto {
  idTipoProducto: number;
  nombre: string;
}

export interface Imagen {
  id_imagen?: number;
  imagenBase64: string;
}
