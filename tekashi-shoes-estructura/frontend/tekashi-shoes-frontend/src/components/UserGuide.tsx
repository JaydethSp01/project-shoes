import React, { useState, useEffect } from "react";
import {
  FaLightbulb,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaRobot,
  FaGlobe,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import "../styles/UserGuide.css";

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentFeature?: string;
}

const UserGuide: React.FC<UserGuideProps> = ({
  isOpen,
  onClose,
  currentFeature,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [featureGuides, setFeatureGuides] = useState<any[]>([]);

  useEffect(() => {
    if (currentFeature) {
      const guides = getFeatureGuides();
      const featureIndex = guides.findIndex(
        (guide) => guide.id === currentFeature
      );
      if (featureIndex !== -1) {
        setCurrentStep(featureIndex);
      }
    }
  }, [currentFeature]);

  const getFeatureGuides = () => [
    {
      id: "search",
      title: "🔍 Búsqueda Inteligente",
      icon: <FaSearch />,
      content: (
        <div className="guide-content">
          <h3>Encuentra tus zapatos perfectos</h3>
          <ul>
            <li>
              Usa la barra de búsqueda para buscar por marca, modelo o color
            </li>
            <li>Prueba términos como "Nike negro" o "tenis deportivos"</li>
            <li>Usa filtros avanzados para refinar tu búsqueda</li>
            <li>
              Nuestro asistente virtual puede ayudarte con búsquedas
              personalizadas
            </li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Combina palabras clave para
            mejores resultados
          </div>
        </div>
      ),
    },
    {
      id: "cart",
      title: "🛒 Carrito de Compras",
      icon: <FaShoppingCart />,
      content: (
        <div className="guide-content">
          <h3>Gestiona tus compras</h3>
          <ul>
            <li>
              Agrega productos al carrito haciendo clic en el botón "Agregar al
              carrito"
            </li>
            <li>Selecciona talla y color antes de agregar</li>
            <li>Revisa tu carrito haciendo clic en el ícono del carrito</li>
            <li>Modifica cantidades o elimina productos según necesites</li>
            <li>Procede al checkout cuando estés listo para comprar</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Tu carrito se guarda
            automáticamente
          </div>
        </div>
      ),
    },
    {
      id: "favorites",
      title: "❤️ Favoritos",
      icon: <FaHeart />,
      content: (
        <div className="guide-content">
          <h3>Guarda tus productos favoritos</h3>
          <ul>
            <li>Haz clic en el corazón para agregar a favoritos</li>
            <li>Accede a tus favoritos desde el menú de usuario</li>
            <li>Crea listas de deseos personalizadas</li>
            <li>Recibe notificaciones cuando bajen de precio</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Los favoritos se sincronizan
            en todos tus dispositivos
          </div>
        </div>
      ),
    },
    {
      id: "account",
      title: "👤 Tu Cuenta",
      icon: <FaUser />,
      content: (
        <div className="guide-content">
          <h3>Gestiona tu perfil</h3>
          <ul>
            <li>Crea una cuenta para guardar tus preferencias</li>
            <li>Accede a tu dashboard personal</li>
            <li>Ve tu historial de compras</li>
            <li>Gestiona tus direcciones de envío</li>
            <li>Acumula puntos de fidelidad</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Los puntos de fidelidad se
            pueden canjear por descuentos
          </div>
        </div>
      ),
    },
    {
      id: "assistant",
      title: "🤖 Asistente Virtual",
      icon: <FaRobot />,
      content: (
        <div className="guide-content">
          <h3>Tu asistente personal de compras</h3>
          <ul>
            <li>Haz clic en el ícono del robot para abrir el chat</li>
            <li>Pregunta sobre productos, tallas o recomendaciones</li>
            <li>Usa los botones de acción rápida</li>
            <li>El asistente está disponible 24/7</li>
            <li>Puede ayudarte con el proceso de compra</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> El asistente aprende de tus
            preferencias
          </div>
        </div>
      ),
    },
    {
      id: "language",
      title: "🌍 Idiomas",
      icon: <FaGlobe />,
      content: (
        <div className="guide-content">
          <h3>Cambia el idioma</h3>
          <ul>
            <li>Usa el selector de idioma en la parte superior</li>
            <li>Disponible en español, inglés, francés y portugués</li>
            <li>La interfaz se adapta automáticamente</li>
            <li>Los productos se muestran en tu idioma preferido</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Tu preferencia de idioma se
            guarda
          </div>
        </div>
      ),
    },
    {
      id: "filters",
      title: "🔧 Filtros Avanzados",
      icon: <FaFilter />,
      content: (
        <div className="guide-content">
          <h3>Refina tu búsqueda</h3>
          <ul>
            <li>Usa filtros por marca, precio, talla y color</li>
            <li>Ordena por precio, popularidad o novedad</li>
            <li>Filtra por ofertas y productos destacados</li>
            <li>Guarda tus filtros favoritos</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Los filtros se pueden combinar
            para resultados más precisos
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "⭐ Reseñas",
      icon: <FaStar />,
      content: (
        <div className="guide-content">
          <h3>Lee y escribe reseñas</h3>
          <ul>
            <li>Lee reseñas de otros compradores</li>
            <li>Escribe tu propia reseña después de comprar</li>
            <li>Califica productos con estrellas</li>
            <li>Ayuda a otros compradores con tu experiencia</li>
          </ul>
          <div className="guide-tip">
            <FaLightbulb /> <strong>Tip:</strong> Las reseñas ayudan a mejorar
            nuestros productos
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setFeatureGuides(getFeatureGuides());
  }, []);

  const currentGuide = featureGuides[currentStep];

  const handleNext = () => {
    if (currentStep < featureGuides.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !currentGuide) return null;

  return (
    <div className="user-guide-overlay">
      <div className="user-guide-modal">
        <div className="user-guide-header">
          <div className="guide-title">
            <div className="guide-icon">{currentGuide.icon}</div>
            <h2>{currentGuide.title}</h2>
          </div>
          <button className="guide-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="user-guide-body">{currentGuide.content}</div>

        <div className="user-guide-footer">
          <div className="guide-progress">
            <div className="progress-dots">
              {featureGuides.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${
                    index === currentStep ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
            <span className="progress-text">
              {currentStep + 1} de {featureGuides.length}
            </span>
          </div>

          <div className="guide-actions">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={handlePrevious}>
                <FaChevronLeft />
                Anterior
              </button>
            )}

            <button className="btn-primary" onClick={handleNext}>
              {currentStep === featureGuides.length - 1
                ? "Finalizar"
                : "Siguiente"}
              {currentStep < featureGuides.length - 1 && <FaChevronRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;


