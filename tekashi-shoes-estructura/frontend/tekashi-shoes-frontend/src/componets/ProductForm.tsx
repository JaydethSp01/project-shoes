import { useState, useEffect } from "react";
import { Product, TipoProducto } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";

interface ProductFormProps {
  isEditing: boolean;
  selectedProduct: Product;
  onSubmit: (product: Product, base64Image: string) => void;
  onClose: () => void;
}

const ProductForm = ({
  isEditing,
  selectedProduct,
  onSubmit,
  onClose,
}: ProductFormProps) => {
  const [product, setProduct] = useState<Product>({
    idProducto: 0,
    tipoProductoId: 0,
    marca: "",
    color: "",
    precio: 0,
    stock: 0,
    imagenId: 0,
  });

  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const cargarTiposProducto = async () => {
      const tipos = await ConexionApiBackend.obtenerTiposProducto();
      setTiposProducto(tipos);
    };
    cargarTiposProducto();

    if (isEditing) {
      setProduct(selectedProduct);
    }
  }, [isEditing, selectedProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSubmit = { ...product };
    onSubmit(productToSubmit, base64Image);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {isEditing ? "Editar Producto" : "Agregar Producto"}
          </h5>
          <button type="button" className="close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-3">
          <div className="form-group">
            <label htmlFor="tipo_producto">Tipo de Producto</label>
            <select
              className="form-control"
              id="tipo_producto"
              name="tipoProductoId"
              value={product.tipoProductoId}
              onChange={handleChange}
            >
              <option value="">Seleccionar tipo de producto</option>
              {tiposProducto.map((tipo) => (
                <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              className="form-control"
              id="marca"
              name="marca"
              value={product.marca}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              className="form-control"
              id="color"
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              value={product.precio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              className="form-control"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen</label>
            <input
              type="file"
              className="form-control"
              id="image"
              onChange={handleFileChange}
            />
            {isEditing && (
              <small className="form-text text-muted">
                Imagen actual: {selectedProduct.marca}.png
              </small>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            {isEditing ? "Guardar Cambios" : "Agregar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
