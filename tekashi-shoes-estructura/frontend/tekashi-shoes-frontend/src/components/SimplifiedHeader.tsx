import React from "react";
import {
  FaHome,
  FaComments,
  FaStar,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSelector from "./LanguageSelector";
import "../styles/SimplifiedHeader.css";

const SimplifiedHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="simplified-header">
      <div className="header-content">
        <div className="header-brand">
          <img src="/logo.png" alt="Tekashi Shoes" className="header-logo" />
          <span className="brand-name">{t("header.brandName")}</span>
        </div>

        <nav className="header-navigation">
          <a href="/" className="nav-link">
            <FaHome />
            <span>Inicio</span>
          </a>
          <a href="/testimonials" className="nav-link">
            <FaComments />
            <span>Testimonios</span>
          </a>
          <a href="/features" className="nav-link">
            <FaStar />
            <span>Características</span>
          </a>
        </nav>

        <div className="header-actions">
          <div className="language-selector-left">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedHeader;
