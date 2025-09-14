import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaTimes,
  FaMinus,
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaTruck,
  FaSpinner,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { cartService, CartItem } from "../services/CartService";
import CheckoutForm from "./CheckoutForm";
import ProductImage from "./ProductImage";
import "../styles/ShoppingCart.css";

interface ShoppingCartProps {
  products: Product[];
  images: { [key: number]: string };
  onShowCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  products,
  images,
  onShowCheckout,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Suscribirse al servicio del carrito
    const unsubscribe = cartService.subscribe((items) => {
      setCartItems(items);
    });

    // Cargar items iniciales
    setCartItems(cartService.getItems());

    return unsubscribe;
  }, []);

  const handleRemoveItem = (productId: number) => {
    cartService.removeItem(productId);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    cartService.clearCart();
  };

  const handleCheckout = async () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    cartService.clearCart();
    setIsOpen(false);
    setShowCheckout(false);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  const getTotalItems = () => cartService.getTotalItems();
  const getTotalPrice = () => cartService.getTotalPrice();
  const getShippingCost = () => cartService.calculateShipping();
  const getTotalWithShipping = () => cartService.getTotalWithShipping();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) {
    return (
      <button
        className="cart-toggle-btn"
        onClick={() => setIsOpen(true)}
        title="Ver carrito de compras"
      >
        <FaShoppingCart />
        {getTotalItems() > 0 && (
          <span className="cart-badge">{getTotalItems()}</span>
        )}
        <span className="cart-total-mini">
          {getTotalPrice() > 0 ? formatPrice(getTotalPrice()) : ""}
        </span>
      </button>
    );
  }

  return (
    <div className="cart-overlay" onClick={() => setIsOpen(false)}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>
            <FaShoppingCart className="me-2" />
            Carrito de Compras
            {getTotalItems() > 0 && (
              <span className="cart-count">({getTotalItems()})</span>
            )}
          </h3>
          <button className="cart-close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart className="empty-cart-icon" />
              <h4>Tu carrito está vacío</h4>
              <p>Agrega algunos productos para comenzar tu compra</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.product.idProducto} className="cart-item">
                    <div className="cart-item-image">
                      <ProductImage
                        marca={item.product.marca}
                        imagenId={item.product.imagenId}
                        images={images}
                        className="cart-product-image"
                        alt={item.product.marca}
                      />
                    </div>

                    <div className="cart-item-details">
                      <h5 className="cart-item-title">{item.product.marca}</h5>
                      <p className="cart-item-color">{item.product.color}</p>
                      <div className="cart-item-price">
                        {formatPrice(item.product.precio)}
                      </div>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.idProducto,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.idProducto,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="quantity-btn"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveItem(item.product.idProducto)
                        }
                        className="remove-item-btn"
                        title="Eliminar del carrito"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      {formatPrice(item.product.precio * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>
                    {getShippingCost() === 0 ? (
                      <span className="free-shipping">
                        <FaTruck className="me-1" />
                        Gratis
                      </span>
                    ) : (
                      formatPrice(getShippingCost())
                    )}
                  </span>
                </div>
                {getTotalPrice() < 200000 && (
                  <div className="shipping-notice">
                    <FaTruck className="me-1" />
                    Agrega {formatPrice(200000 - getTotalPrice())} más para
                    envío gratis
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalWithShipping())}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  onClick={handleClearCart}
                  className="btn btn-outline-danger btn-clear"
                >
                  <FaTrash className="me-2" />
                  Vaciar Carrito
                </button>
                <button
                  onClick={() => {
                    onShowCheckout();
                    setIsOpen(false);
                  }}
                  className="btn btn-primary btn-checkout"
                >
                  <FaCreditCard className="me-2" />
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Formulario de Checkout */}
      {showCheckout && (
        <CheckoutForm
          cartItems={cartItems}
          total={getTotalWithShipping()}
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
