import React, { useState, useEffect } from "react";
import { FaGift, FaCrown, FaRocket, FaShieldAlt, FaHeart, FaStar, FaFire, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import "../styles/UniqueEcommerceFeatures.css";

interface UniqueFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  isActive: boolean;
  progress?: number;
}

const UniqueEcommerceFeatures: React.FC = () => {
  const { currentUser } = useAuth();
  const [features, setFeatures] = useState<UniqueFeature[]>([]);
  const [showFeatures, setShowFeatures] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Simular carga de funcionalidades únicas
    const uniqueFeatures: UniqueFeature[] = [
      {
        id: "vip-status",
        title: t("uniqueFeatures.vipStatus"),
        description: t("uniqueFeatures.vipStatusDesc"),
        icon: <FaCrown />,
        gradient: "linear-gradient(135deg, #ffd700, #ffed4e)",
        isActive: true,
        progress: 85
      },
      {
        id: "loyalty-points",
        title: t("uniqueFeatures.loyaltyPoints"),
        description: t("uniqueFeatures.loyaltyPointsDesc"),
        icon: <FaGift />,
        gradient: "linear-gradient(135deg, #00d4ff, #00ff88)",
        isActive: true,
        progress: 60
      },
      {
        id: "express-delivery",
        title: t("uniqueFeatures.expressDelivery"),
        description: t("uniqueFeatures.expressDeliveryDesc"),
        icon: <FaRocket />,
        gradient: "linear-gradient(135deg, #ff6b6b, #ffa500)",
        isActive: true,
        progress: 100
      },
      {
        id: "warranty-plus",
        title: t("uniqueFeatures.warrantyPlus"),
        description: t("uniqueFeatures.warrantyPlusDesc"),
        icon: <FaShieldAlt />,
        gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
        isActive: true,
        progress: 100
      },
      {
        id: "wishlist-priority",
        title: t("uniqueFeatures.wishlistPremium"),
        description: t("uniqueFeatures.wishlistPremiumDesc"),
        icon: <FaHeart />,
        gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)",
        isActive: true,
        progress: 75
      },
      {
        id: "exclusive-access",
        title: t("uniqueFeatures.exclusiveAccess"),
        description: t("uniqueFeatures.exclusiveAccessDesc"),
        icon: <FaStar />,
        gradient: "linear-gradient(135deg, #667eea, #764ba2)",
        isActive: true,
        progress: 90
      },
      {
        id: "hot-deals",
        title: t("uniqueFeatures.hotDeals"),
        description: t("uniqueFeatures.hotDealsDesc"),
        icon: <FaFire />,
        gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)",
        isActive: true,
        progress: 45
      },
      {
        id: "early-bird",
        title: t("uniqueFeatures.earlyBird"),
        description: t("uniqueFeatures.earlyBirdDesc"),
        icon: <FaClock />,
        gradient: "linear-gradient(135deg, #8360c3, #2ebf91)",
        isActive: true,
        progress: 30
      }
    ];

    setFeatures(uniqueFeatures);
  }, [t]);

  const toggleFeatures = () => {
    setShowFeatures(!showFeatures);
  };

  return (
    <div className="unique-ecommerce-features">
      <div className="features-toggle" onClick={toggleFeatures}>
        <div className="toggle-content">
          <div className="toggle-icon">
            <FaCrown />
          </div>
          <div className="toggle-text">
            <h3>Funcionalidades Únicas</h3>
            <p>Descubre las ventajas exclusivas de ser cliente Tekashi</p>
          </div>
          <div className={`toggle-arrow ${showFeatures ? 'active' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {showFeatures && (
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className={`feature-card ${feature.isActive ? 'active' : 'inactive'}`}>
              <div className="feature-header">
                <div 
                  className="feature-icon"
                  style={{ background: feature.gradient }}
                >
                  {feature.icon}
                </div>
                <div className="feature-status">
                  {feature.isActive ? (
                    <span className="status-badge active">Activo</span>
                  ) : (
                    <span className="status-badge inactive">Inactivo</span>
                  )}
                </div>
              </div>
              
              <div className="feature-content">
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
                
                {feature.progress !== undefined && (
                  <div className="feature-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${feature.progress}%`,
                          background: feature.gradient
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{feature.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="features-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{features.filter(f => f.isActive).length}</span>
            <span className="stat-label">Funcionalidades Activas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">VIP</span>
            <span className="stat-label">Estado Premium</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Beneficios Ilimitados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueEcommerceFeatures;
