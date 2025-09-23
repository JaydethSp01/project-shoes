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
    <div className="login-prompt-overlay" onClick={onClose}>
      <div className="login-prompt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-prompt-header">
          <div className="login-prompt-icon">
            <FaShoppingCart />
          </div>
          <h3>¡Completa tu compra!</h3>
          <button className="login-prompt-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="login-prompt-content">
          <div className="login-prompt-benefits">
            <h4>🔐 Inicia sesión para una mejor experiencia:</h4>
            <ul>
              <li>
                <FaUser className="benefit-icon" />
                Guardar tu historial de pedidos
              </li>
              <li>
                <FaUser className="benefit-icon" />
                Recibir notificaciones de envío
              </li>
              <li>
                <FaUser className="benefit-icon" />
                Acceder a descuentos exclusivos
              </li>
              <li>
                <FaUser className="benefit-icon" />
                Puntos de fidelidad
              </li>
            </ul>
          </div>

          <div className="login-prompt-actions">
            <button
              className="btn-login-primary"
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
