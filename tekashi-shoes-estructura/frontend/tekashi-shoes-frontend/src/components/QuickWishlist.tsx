import React, { useState, useEffect } from "react";
import { FaHeart, FaTimes, FaShoppingCart, FaEye } from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { useAuth } from "../hooks/useAuth";
import "../styles/QuickWishlist.css";

interface QuickWishlistProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

const QuickWishlist: React.FC<QuickWishlistProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onViewProduct,
}) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadWishlist();
    }
  }, [isOpen, user]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      // Simular carga de wishlist
      const mockWishlist = [
        {
          id: 1,
          nombre: "Nike Air Max 270",
          precio: 450000,
          imagen: "/shoe1.jpg",
          marca: "Nike",
          color: "Blanco",
          talla: "42",
        },
        {
          id: 2,
          nombre: "Adidas Ultraboost 22",
          precio: 380000,
          imagen: "/shoe2.jpg",
          marca: "Adidas",
          color: "Negro",
          talla: "41",
        },
      ];
      setWishlistItems(mockWishlist);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    // Mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'quick-notification';
    notification.textContent = '¡Agregado al carrito!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="quick-wishlist-overlay">
      <div className="quick-wishlist-modal">
        <div className="quick-wishlist-header">
          <h3>Mi Lista de Deseos</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="quick-wishlist-content">
          {isLoading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <FaHeart className="empty-icon" />
              <p>Tu lista de deseos está vacía</p>
              <button className="btn btn-primary" onClick={onClose}>
                Explorar Productos
              </button>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.imagen} alt={item.nombre} />
                  </div>
                  <div className="item-details">
                    <h4>{item.nombre}</h4>
                    <p className="item-brand">{item.marca}</p>
                    <p className="item-color">Color: {item.color}</p>
                    <p className="item-size">Talla: {item.talla}</p>
                    <p className="item-price">${item.precio?.toLocaleString()}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn add-to-cart"
                      onClick={() => handleAddToCart(item)}
                      title="Agregar al carrito"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      className="action-btn view-product"
                      onClick={() => onViewProduct(item)}
                      title="Ver producto"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn remove"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Eliminar de lista"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="quick-wishlist-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Continuar Comprando
            </button>
            <button className="btn btn-primary">
              Ver Lista Completa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickWishlist;
