import React from "react";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/SimplifiedHeader.css";

interface SimplifiedHeaderProps {
  onCartOpen: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ onCartOpen }) => {
  const { t } = useTranslation();

  return (
    <div className="simplified-header">
      <div className="header-content">
        <div className="header-brand">
          <img src="/logo.png" alt="Tekashi Shoes" className="header-logo" />
          <span className="brand-name">{t("header.brandName")}</span>
        </div>

        <div className="header-actions">
          <button className="header-btn search-btn" title={t("search")}>
            <FaSearch />
          </button>
          <button
            className="header-btn cart-btn"
            onClick={onCartOpen}
            title={t("cart")}
          >
            <FaShoppingCart />
          </button>
          <button className="header-btn user-btn" title={t("user")}>
            <FaUser />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedHeader;
