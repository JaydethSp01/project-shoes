import { useState, useEffect } from "react";
import { Product } from "../modelos/productTypes";

interface ProductFormProps {
  isEditing: boolean;
  selectedProduct: Product;
  onSubmit: (product: Product) => void;
  onClose: () => void;
}

const ProductForm = ({
  isEditing,
  selectedProduct,
  onSubmit,
  onClose,
}: ProductFormProps) => {
  const [product, setProduct] = useState<Product>({
    id_producto: 0,
    tipo_producto: 0,
    marca: "",
    color: "",
    precio: 0,
    stock: 0,
  });

  useEffect(() => {
    if (isEditing) {
      setProduct(selectedProduct); // Prellenar el formulario con los datos del producto
    }
  }, [isEditing, selectedProduct]);

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
    onSubmit(product);
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
              name="tipo_producto"
              value={product.tipo_producto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo de producto</option>
              <option value={1}>Electrónica</option>
              <option value={2}>Ropa</option>
              <option value={3}>Alimentos</option>
              {/* Puedes agregar más opciones */}
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
              required
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
              required
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
              required
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
              required
            />
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
