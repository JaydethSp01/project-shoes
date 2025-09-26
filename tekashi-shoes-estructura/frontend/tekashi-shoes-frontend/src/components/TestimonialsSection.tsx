import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/TestimonialsSection.css";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  purchase: string;
}

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: t("testimonials.customerName"),
      location: t("testimonials.customerLocation"),
      rating: 5,
      comment: t("testimonials.customerComment"),
      avatar: "👩‍💼",
      purchase: t("testimonials.customerPurchase"),
    },
    {
      id: 2,
      name: t("testimonials.customerName2"),
      location: t("testimonials.customerLocation2"),
      rating: 5,
      comment: t("testimonials.customerComment2"),
      avatar: "👨‍💻",
      purchase: t("testimonials.customerPurchase2"),
    },
    {
      id: 3,
      name: t("testimonials.customerName3"),
      location: t("testimonials.customerLocation3"),
      rating: 5,
      comment: t("testimonials.customerComment3"),
      avatar: "👩‍🎨",
      purchase: t("testimonials.customerPurchase3"),
    },
    {
      id: 4,
      name: t("testimonials.customerName4"),
      location: t("testimonials.customerLocation4"),
      rating: 5,
      comment: t("testimonials.customerComment4"),
      avatar: "👨‍🎓",
      purchase: t("testimonials.customerPurchase4"),
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`star ${index < rating ? "filled" : "empty"}`}
      />
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">{t("testimonials.title")}</h2>
          <p className="section-subtitle">{t("testimonials.subtitle")}</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="customer-info">
                  <div className="customer-avatar">{testimonial.avatar}</div>
                  <div className="customer-details">
                    <h4 className="customer-name">{testimonial.name}</h4>
                    <p className="customer-location">{testimonial.location}</p>
                    <p className="customer-purchase">
                      Compró: {testimonial.purchase}
                    </p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-comment">"{testimonial.comment}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">{t("testimonials.averageRating")}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">
              {t("testimonials.satisfiedCustomers")}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">
              {t("testimonials.recommendations")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
