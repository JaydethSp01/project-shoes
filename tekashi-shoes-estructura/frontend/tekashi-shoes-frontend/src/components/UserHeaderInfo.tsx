import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaGift, FaCrown } from "react-icons/fa";
import { authService, User } from "../services/AuthService";
import { cartService } from "../services/CartService";
import "../styles/UserHeaderInfo.css";

interface UserHeaderInfoProps {
  onShowCart: () => void;
}

const UserHeaderInfo: React.FC<UserHeaderInfoProps> = ({ onShowCart }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [userLevel, setUserLevel] = useState("");

  useEffect(() => {
    // Suscribirse a cambios en el usuario
    const unsubscribeUser = authService.subscribe((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoyaltyPoints(currentUser.loyaltyPoints || 0);
        setUserLevel(currentUser.userLevel || "Bronze");
      }
    });

    // Suscribirse a cambios en el carrito
    const unsubscribeCart = cartService.subscribe((items) => {
      setCartItemCount(items.length);
      setCartTotal(cartService.getTotal());
    });

    // Cargar datos iniciales
    loadInitialData();

    return () => {
      unsubscribeUser();
      unsubscribeCart();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setLoyaltyPoints(currentUser.loyaltyPoints || 0);
        setUserLevel(currentUser.userLevel || "Bronze");

        // Cargar datos del carrito
        const cartItems = cartService.getCartItems();
        setCartItemCount(cartItems.length);
        setCartTotal(cartService.getTotal());
      }
    } catch (error) {
      console.error("Error loading user header data:", error);
    }
  };

  const getUserLevelColor = (level: string): string => {
    switch (level) {
      case "Bronze":
        return "#cd7f32";
      case "Silver":
        return "#c0c0c0";
      case "Gold":
        return "#ffd700";
      case "Platinum":
        return "#e5e4e2";
      default:
        return "#cd7f32";
    }
  };

  const getUserLevelName = (level: string): string => {
    switch (level) {
      case "Bronze":
        return "Bronce";
      case "Silver":
        return "Plata";
      case "Gold":
        return "Oro";
      case "Platinum":
        return "Platino";
      default:
        return "Bronce";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-header-info">
      {/* Carrito de Compras */}
      <div className="header-cart" onClick={onShowCart}>
        <div className="cart-icon-container">
          <FaShoppingCart className="cart-icon" />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </div>
        {cartTotal > 0 && (
          <div className="cart-total">${cartTotal.toLocaleString()}</div>
        )}
      </div>

      {/* Información del Usuario */}
      <div className="header-user-info">
        <div
          className="user-level"
          style={{ color: getUserLevelColor(userLevel) }}
        >
          <FaCrown className="crown-icon" />
          <span>{getUserLevelName(userLevel)}</span>
        </div>

        <div className="loyalty-points">
          <FaGift className="points-icon" />
          <span>{loyaltyPoints} pts</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeaderInfo;
