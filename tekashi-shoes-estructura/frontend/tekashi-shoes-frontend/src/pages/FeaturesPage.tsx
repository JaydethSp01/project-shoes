import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTruck,
  FaUndo,
  FaCreditCard,
  FaMobile,
} from "react-icons/fa";
import FeaturesSection from "../components/FeaturesSection";
import UniqueEcommerceFeatures from "../components/UniqueEcommerceFeatures";
import SimplifiedHeader from "../components/SimplifiedHeader";
import Footer from "../components/Footer";
import "../styles/FeaturesPage.css";

const FeaturesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="features-page">
      <SimplifiedHeader />

      <main className="features-main">
        {/* Botón Volver al Home */}
        <div className="back-to-home">
          <div className="container">
            <Link to="/" className="back-btn">
              <FaArrowLeft className="back-icon" />
              Volver al Home
            </Link>
          </div>
        </div>

        <div className="page-header">
          <div className="container">
            <h1 className="page-title">{t("features.title")}</h1>
            <p className="page-subtitle">{t("features.subtitle")}</p>
          </div>
        </div>

        <FeaturesSection />

        {/* Funcionalidades Únicas de Ecommerce */}
        <div className="container">
          <UniqueEcommerceFeatures />
        </div>

        <section className="additional-features">
          <div className="container">
            <h2 className="section-title">Características Adicionales</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <h3>Envío Gratis</h3>
                <p>En compras superiores a $100.000</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaUndo />
                </div>
                <h3>Devoluciones Fáciles</h3>
                <p>30 días para cambiar o devolver</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaCreditCard />
                </div>
                <h3>Pagos Seguros</h3>
                <p>Múltiples métodos de pago</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaMobile />
                </div>
                <h3>App Móvil</h3>
                <p>Compra desde cualquier dispositivo</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                ¿Listo para experimentar nuestras características?
              </h2>
              <p className="cta-description">
                Descubre por qué miles de clientes eligen Tekashi Shoes
              </p>
              <div className="cta-buttons">
                <Link to="/" className="btn btn-secondary">
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
