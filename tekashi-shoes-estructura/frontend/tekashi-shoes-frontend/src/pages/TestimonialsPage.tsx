import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaStar, FaQuoteLeft } from "react-icons/fa";
import TestimonialsSection from "../components/TestimonialsSection";
import UniqueEcommerceFeatures from "../components/UniqueEcommerceFeatures";
import SimplifiedHeader from "../components/SimplifiedHeader";
import Footer from "../components/Footer";
import "../styles/TestimonialsPage.css";

const TestimonialsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="testimonials-page">
      <SimplifiedHeader />

      <main className="testimonials-main">
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
            <h1 className="page-title">{t("testimonials.title")}</h1>
            <p className="page-subtitle">{t("testimonials.subtitle")}</p>
          </div>
        </div>

        <TestimonialsSection />

        {/* Funcionalidades Únicas de Ecommerce */}
        <div className="container">
          <UniqueEcommerceFeatures />
        </div>

        <section className="additional-testimonials">
          <div className="container">
            <h2 className="section-title">
              Más Testimonios de Nuestros Clientes
            </h2>
            <div className="testimonials-grid-extended">
              <div className="testimonial-card-extended">
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">
                    "La calidad de los zapatos es excepcional. Llevo más de un
                    año comprando aquí y nunca me han decepcionado. El servicio
                    al cliente es increíble."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>María González</h4>
                      <p>Bogotá, Colombia</p>
                    </div>
                    <div className="rating">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card-extended">
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">
                    "Me encanta la variedad de estilos disponibles. Siempre
                    encuentro lo que busco y la calidad es consistente.
                    Excelente tienda online."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Carmen López</h4>
                      <p>Cali, Colombia</p>
                    </div>
                    <div className="rating">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card-extended">
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">
                    "Los envíos son súper rápidos y el empaque es perfecto. Los
                    zapatos llegan en excelente estado. Definitivamente
                    recomiendo esta tienda."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Carlos Rodríguez</h4>
                      <p>Medellín, Colombia</p>
                    </div>
                    <div className="rating">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card-extended">
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">
                    "La atención al cliente es de primera. Me ayudaron a elegir
                    el zapato perfecto y el proceso de compra fue muy fácil.
                    ¡Volveré a comprar!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Ana Martínez</h4>
                      <p>Barranquilla, Colombia</p>
                    </div>
                    <div className="rating">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                ¿Quieres ser parte de nuestra comunidad?
              </h2>
              <p className="cta-description">
                Únete a miles de clientes satisfechos y descubre por qué
                elegimos Tekashi Shoes
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

export default TestimonialsPage;
