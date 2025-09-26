import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import "../styles/ProductComparator.css";

interface ProductComparatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

const ProductComparator: React.FC<ProductComparatorProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
}) => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  // Productos de ejemplo para comparar
  const sampleProducts: Product[] = [
    {
      id: 1,
      nombre: "Nike Air Max 270",
      precio: 450000,
      imagen: "/shoe1.jpg",
      marca: "Nike",
      color: "Blanco",
      talla: "42",
      descripcion: "Zapatillas deportivas con tecnología Air Max",
      tipoProductoId: 1,
    },
    {
      id: 2,
      nombre: "Adidas Ultraboost 22",
      precio: 380000,
      imagen: "/shoe2.jpg",
      marca: "Adidas",
      color: "Negro",
      talla: "41",
      descripcion: "Zapatillas de running con tecnología Boost",
      tipoProductoId: 1,
    },
    {
      id: 3,
      nombre: "Puma RS-X",
      precio: 320000,
      imagen: "/shoe3.jpg",
      marca: "Puma",
      color: "Azul",
      talla: "40",
      descripcion: "Zapatillas urbanas con diseño futurista",
      tipoProductoId: 1,
    },
  ];

  const addToComparison = (product: Product) => {
    if (comparisonProducts.length < 3 && !comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts([...comparisonProducts, product]);
    }
  };

  const removeFromComparison = (productId: number) => {
    setComparisonProducts(comparisonProducts.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  const getComparisonValue = (product: Product, attribute: string) => {
    switch (attribute) {
      case 'precio':
        return `$${product.precio?.toLocaleString()}`;
      case 'marca':
        return product.marca || 'N/A';
      case 'color':
        return product.color || 'N/A';
      case 'talla':
        return product.talla || 'N/A';
      default:
        return 'N/A';
    }
  };

  const getBestValue = (attribute: string) => {
    if (comparisonProducts.length === 0) return null;
    
    if (attribute === 'precio') {
      const cheapest = comparisonProducts.reduce((min, product) => 
        (product.precio || 0) < (min.precio || 0) ? product : min
      );
      return cheapest.id;
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="product-comparator-overlay">
      <div className="product-comparator-modal">
        <div className="comparator-header">
          <h3>Comparador de Productos</h3>
          <div className="header-actions">
            <button className="clear-btn" onClick={clearComparison}>
              Limpiar Todo
            </button>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="comparator-content">
          {comparisonProducts.length === 0 ? (
            <div className="empty-comparison">
              <div className="empty-icon">⚖️</div>
              <h4>Agrega productos para comparar</h4>
              <p>Selecciona hasta 3 productos para comparar características</p>
              
              <div className="sample-products">
                <h5>Productos Sugeridos:</h5>
                <div className="sample-grid">
                  {sampleProducts.map((product) => (
                    <div key={product.id} className="sample-product">
                      <img src={product.imagen} alt={product.nombre} />
                      <h6>{product.nombre}</h6>
                      <p className="sample-price">${product.precio?.toLocaleString()}</p>
                      <button 
                        className="add-compare-btn"
                        onClick={() => addToComparison(product)}
                      >
                        <FaPlus /> Comparar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="comparison-table">
              <div className="comparison-header">
                <div className="attribute-column">Características</div>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="product-column">
                    <div className="product-header">
                      <img src={product.imagen} alt={product.nombre} />
                      <h4>{product.nombre}</h4>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromComparison(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="comparison-rows">
                {['precio', 'marca', 'color', 'talla'].map((attribute) => (
                  <div key={attribute} className="comparison-row">
                    <div className="attribute-name">
                      {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                    </div>
                    {comparisonProducts.map((product) => {
                      const value = getComparisonValue(product, attribute);
                      const isBest = getBestValue(attribute) === product.id;
                      return (
                        <div 
                          key={product.id} 
                          className={`product-value ${isBest ? 'best-value' : ''}`}
                        >
                          {value}
                          {isBest && <span className="best-badge">Mejor</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="comparison-actions">
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="product-actions">
                    <button 
                      className="action-btn add-cart"
                      onClick={() => onAddToCart(product)}
                    >
                      <FaShoppingCart /> Agregar al Carrito
                    </button>
                    <button 
                      className="action-btn add-wishlist"
                      onClick={() => onAddToWishlist(product)}
                    >
                      <FaHeart /> Lista de Deseos
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComparator;
