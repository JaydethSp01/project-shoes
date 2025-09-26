import React from "react";
import {
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaCreditCard,
  FaUndo,
  FaGift,
  FaLock,
  FaTruck,
  FaStar,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/FeaturesSection.css";

interface Feature {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  highlight?: string;
}

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      id: 1,
      icon: FaShippingFast,
      title: t("features.freeShipping"),
      description: t("features.freeShippingDesc"),
      highlight: t("features.freeShippingHighlight"),
    },
    {
      id: 2,
      icon: FaShieldAlt,
      title: t("features.qualityGuarantee"),
      description: t("features.qualityGuaranteeDesc"),
      highlight: t("features.qualityGuaranteeHighlight"),
    },
    {
      id: 3,
      icon: FaHeadset,
      title: t("features.support247"),
      description: t("features.support247Desc"),
      highlight: t("features.support247Highlight"),
    },
    {
      id: 4,
      icon: FaCreditCard,
      title: t("features.securePayments"),
      description: t("features.securePaymentsDesc"),
      highlight: t("features.securePaymentsHighlight"),
    },
    {
      id: 5,
      icon: FaUndo,
      title: t("features.easyReturns"),
      description: t("features.easyReturnsDesc"),
      highlight: t("features.easyReturnsHighlight"),
    },
    {
      id: 6,
      icon: FaGift,
      title: t("features.loyaltyProgram"),
      description: t("features.loyaltyProgramDesc"),
      highlight: t("features.loyaltyProgramHighlight"),
    },
  ];

  const benefits = [
    {
      icon: FaLock,
      title: t("features.securePurchase"),
      description: t("features.securePurchaseDesc"),
    },
    {
      icon: FaTruck,
      title: t("features.fastDelivery"),
      description: t("features.fastDeliveryDesc"),
    },
    {
      icon: FaStar,
      title: t("features.premiumQuality"),
      description: t("features.premiumQualityDesc"),
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">{t("features.title")}</h2>
          <p className="section-subtitle">{t("features.subtitle")}</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <IconComponent />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">
                    {feature.title}
                    {feature.highlight && (
                      <span className="feature-highlight">
                        {feature.highlight}
                      </span>
                    )}
                  </h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="benefits-section">
          <h3 className="benefits-title">{t("features.additionalBenefits")}</h3>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">
                    <IconComponent />
                  </div>
                  <div className="benefit-content">
                    <h4 className="benefit-title">{benefit.title}</h4>
                    <p className="benefit-description">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">{t("features.ctaTitle")}</h3>
            <p className="cta-description">{t("features.ctaDescription")}</p>
            <div className="cta-buttons">
              <button className="btn btn-primary cta-btn">
                {t("features.viewCollection")}
              </button>
              <button className="btn btn-secondary cta-btn">
                {t("features.learnMore")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
