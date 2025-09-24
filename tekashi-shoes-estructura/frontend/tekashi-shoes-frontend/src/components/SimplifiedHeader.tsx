import React from "react";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import "../styles/SimplifiedHeader.css";

interface SimplifiedHeaderProps {
  onCartOpen: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ onCartOpen }) => {
  return (
    <div className="simplified-header">
      <div className="header-content">
        <div className="header-brand">
          <img src="/logo.png" alt="Tekashi Shoes" className="header-logo" />
          <span className="brand-name">Tekashi Shoes</span>
        </div>
        
        <div className="header-actions">
          <button className="header-btn search-btn" title="Buscar">
            <FaSearch />
          </button>
          <button className="header-btn cart-btn" onClick={onCartOpen} title="Carrito">
            <FaShoppingCart />
          </button>
          <button className="header-btn user-btn" title="Usuario">
            <FaUser />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedHeader;
