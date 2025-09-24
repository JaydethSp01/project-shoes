import React from "react";
import { FaUser, FaShoppingCart, FaTimes, FaArrowRight } from "react-icons/fa";
import "../styles/LoginPromptModal.css";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onContinueAsGuest: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onContinueAsGuest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-content">
          <div className="login-prompt-header">
            <div className="login-prompt-icon">
              <FaShoppingCart />
            </div>
            <h3>¡Completa tu compra!</h3>
          </div>

          <div className="benefits-section">
            <h4 className="benefits-title">
              🔐 Inicia sesión para una mejor experiencia:
            </h4>
            <div className="benefits-list">
              <div className="benefit-item">
                <FaUser className="benefit-icon" />
                Guardar tu historial de pedidos
              </div>
              <div className="benefit-item">
                <FaUser className="benefit-icon" />
                Recibir notificaciones de envío
              </div>
              <div className="benefit-item">
                <FaUser className="benefit-icon" />
                Acceder a descuentos exclusivos
              </div>
              <div className="benefit-item">
                <FaUser className="benefit-icon" />
                Puntos de fidelidad
              </div>
            </div>
          </div>

          <div className="login-prompt-actions">
            <button
              className="login-btn"
              onClick={() => {
                onLogin();
                onClose();
              }}
            >
              <FaUser />
              Iniciar Sesión
              <FaArrowRight />
            </button>

            <button
              className="btn-continue-guest"
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
            >
              Continuar como invitado
            </button>
          </div>

          <div className="login-prompt-note">
            <p>
              💡 <strong>Tip:</strong> Puedes registrarte después de completar
              tu compra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
