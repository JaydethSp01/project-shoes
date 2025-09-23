import React from "react";
import {
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaRobot,
  FaGlobe,
} from "react-icons/fa";
import "../styles/OnboardingModal.css";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onNext,
  onPrevious,
  onSkip,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "¡Bienvenido a Tekashi Shoes! 👋",
      content: (
        <div className="onboarding-content">
          <div className="onboarding-icon">👟</div>
          <p>
            Te damos la bienvenida a la mejor tienda de zapatos online. Te
            guiaremos paso a paso para que tengas la mejor experiencia de
            compra.
          </p>
          <div className="features-preview">
            <div className="feature-item">
              <FaSearch className="feature-icon" />
              <span>Búsqueda inteligente</span>
            </div>
            <div className="feature-item">
              <FaShoppingCart className="feature-icon" />
              <span>Carrito de compras</span>
            </div>
            <div className="feature-item">
              <FaHeart className="feature-icon" />
              <span>Favoritos</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🔍 Busca tus zapatos favoritos",
      content: (
        <div className="onboarding-content">
          <div className="onboarding-icon">🔍</div>
          <p>
            Usa la barra de búsqueda para encontrar zapatos por marca, tipo o
            color. También puedes usar nuestro asistente virtual para una
            búsqueda más personalizada.
          </p>
          <div className="search-examples">
            <div className="example-tag">Nike</div>
            <div className="example-tag">Tenis deportivos</div>
            <div className="example-tag">Zapatos negros</div>
          </div>
        </div>
      ),
    },
    {
      title: "🛒 Agrega al carrito y compra",
      content: (
        <div className="onboarding-content">
          <div className="onboarding-icon">🛒</div>
          <p>
            Cuando encuentres el zapato perfecto, agrégalo al carrito. Puedes
            revisar tu carrito, modificar cantidades y proceder al checkout de
            forma segura.
          </p>
          <div className="cart-features">
            <div className="cart-feature">
              <span>✅</span>
              <span>Selección de talla y color</span>
            </div>
            <div className="cart-feature">
              <span>✅</span>
              <span>Cálculo automático de totales</span>
            </div>
            <div className="cart-feature">
              <span>✅</span>
              <span>Checkout seguro</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🤖 Tu asistente personal",
      content: (
        <div className="onboarding-content">
          <div className="onboarding-icon">🤖</div>
          <p>
            Nuestro asistente virtual está aquí para ayudarte 24/7. Puede
            ayudarte a encontrar productos, responder preguntas y guiarte en tu
            compra.
          </p>
          <div className="assistant-features">
            <div className="assistant-feature">
              <FaRobot className="assistant-icon" />
              <span>Búsqueda inteligente</span>
            </div>
            <div className="assistant-feature">
              <FaGlobe className="assistant-icon" />
              <span>Múltiples idiomas</span>
            </div>
            <div className="assistant-feature">
              <FaUser className="assistant-icon" />
              <span>Recomendaciones personalizadas</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🎉 ¡Estás listo para comprar!",
      content: (
        <div className="onboarding-content">
          <div className="onboarding-icon">🎉</div>
          <p>
            Ya conoces todas las funcionalidades principales de Tekashi Shoes.
            ¡Explora nuestra colección y encuentra los zapatos perfectos para
            ti!
          </p>
          <div className="final-tips">
            <div className="tip">
              <strong>💡 Tip:</strong> Crea una cuenta para guardar tus
              favoritos y ver tu historial de compras.
            </div>
            <div className="tip">
              <strong>🌍 Tip:</strong> Cambia el idioma usando el selector en la
              parte superior.
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem("tekashi-onboarding-seen", "true");
      onClose();
    } else {
      onNext();
    }
  };

  const handleSkip = () => {
    localStorage.setItem("tekashi-onboarding-seen", "true");
    onSkip();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <h2>{currentStepData.title}</h2>
          <button className="onboarding-close" onClick={handleSkip}>
            <FaTimes />
          </button>
        </div>

        <div className="onboarding-body">{currentStepData.content}</div>

        <div className="onboarding-footer">
          <div className="onboarding-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
            <span className="progress-text">
              {currentStep + 1} de {steps.length}
            </span>
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={onPrevious}>
                <FaChevronLeft />
                Anterior
              </button>
            )}

            <button className="btn-skip" onClick={handleSkip}>
              Omitir
            </button>

            <button className="btn-primary" onClick={handleNext}>
              {isLastStep ? "¡Comenzar!" : "Siguiente"}
              {!isLastStep && <FaChevronRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;


