import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSave,
  FaSpinner,
  FaUpload,
  FaImage,
  FaDollarSign,
  FaBox,
  FaTag,
  FaPalette,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import "../styles/ProductManagementModal.css";

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductSaved: (savedProduct: Product) => void;
}

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductSaved,
}) => {
  const [productData, setProductData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    marca: "",
    color: "",
    tipoProductoId: "",
  });
  const [tiposProducto, setTiposProducto] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadTiposProducto();
      if (product) {
        setProductData({
          nombre: product.nombre || "",
          descripcion: product.descripcion || "",
          precio: product.precio?.toString() || "",
          stock: product.stock?.toString() || "",
          marca: product.marca || "",
          color: product.color || "",
          tipoProductoId: product.tipoProductoId?.toString() || "",
        });
      } else {
        setProductData({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          marca: "",
          color: "",
          tipoProductoId: "",
        });
      }
      setError("");
      setSuccess("");
    }
  }, [isOpen, product]);

  const loadTiposProducto = async () => {
    try {
      const tipos = await ConexionApiBackend.obtenerTiposProducto();
      setTiposProducto(tipos);
    } catch (error) {
      console.error("Error loading product types:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!productData.nombre.trim()) {
      setError("El nombre del producto es requerido");
      return false;
    }
    if (!productData.precio.trim() || isNaN(Number(productData.precio))) {
      setError("El precio debe ser un número válido");
      return false;
    }
    if (!productData.stock.trim() || isNaN(Number(productData.stock))) {
      setError("El stock debe ser un número válido");
      return false;
    }
    if (!productData.marca.trim()) {
      setError("La marca es requerida");
      return false;
    }
    if (!productData.tipoProductoId) {
      setError("Debe seleccionar un tipo de producto");
      return false;
    }
    return true;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const productToSave = {
        nombre: productData.nombre.trim(),
        descripcion: productData.descripcion.trim(),
        precio: Number(productData.precio),
        stock: Number(productData.stock),
        marca: productData.marca.trim(),
        color: productData.color.trim(),
        tipoProductoId: Number(productData.tipoProductoId),
      };

      let savedProduct;
      if (product) {
        // Actualizar producto existente
        savedProduct = await ConexionApiBackend.actualizarProducto(
          product.idProducto,
          productToSave
        );
        setSuccess("Producto actualizado exitosamente");
      } else {
        // Crear nuevo producto
        savedProduct = await ConexionApiBackend.agregarProducto(productToSave);
        setSuccess("Producto creado exitosamente");
      }

      onProductSaved(savedProduct);
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error al guardar el producto. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-management-overlay">
      <div className="product-management-modal">
        <div className="modal-header">
          <h2>
            {product ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message">
              <p>{success}</p>
            </div>
          )}

          <div className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaTag className="input-icon" />
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={productData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: Nike Air Max 270"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaTag className="input-icon" />
                  Marca *
                </label>
                <input
                  type="text"
                  value={productData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                  placeholder="Ej: Nike"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaDollarSign className="input-icon" />
                  Precio *
                </label>
                <input
                  type="number"
                  value={productData.precio}
                  onChange={(e) => handleInputChange("precio", e.target.value)}
                  placeholder="299000"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaBox className="input-icon" />
                  Stock *
                </label>
                <input
                  type="number"
                  value={productData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="50"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaPalette className="input-icon" />
                  Color
                </label>
                <input
                  type="text"
                  value={productData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Ej: Negro, Blanco, Azul"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Tipo de Producto *</label>
                <select
                  value={productData.tipoProductoId}
                  onChange={(e) => handleInputChange("tipoProductoId", e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Seleccionar tipo...</option>
                  {tiposProducto.map((tipo) => (
                    <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                value={productData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Describe las características del producto..."
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              className="save-btn"
              onClick={handleSaveProduct}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinning" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave />
                  {product ? "Actualizar Producto" : "Crear Producto"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementModal;

