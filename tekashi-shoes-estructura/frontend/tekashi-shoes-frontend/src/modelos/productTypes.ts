export interface Product {
  idProducto: number;
  nombre?: string;
  descripcion?: string;
  tipoProductoId: number;
  marca: string;
  color: string;
  talla?: string;
  precio: number;
  stock: number;
  imagenId: number;
  imagen?: string;
  id?: number;
}

export interface TipoProducto {
  idTipoProducto: number;
  nombre: string;
}

export interface Imagen {
  id_imagen?: number;
  imagenBase64: string;
}
