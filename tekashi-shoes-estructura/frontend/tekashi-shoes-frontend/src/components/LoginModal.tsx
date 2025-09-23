import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSignInAlt,
  FaGoogle,
  FaFacebook,
  FaMicrosoft,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/AuthForms.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onShowRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onShowRegister,
}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hooks
  const {
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    clearError,
  } = useAuth();
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    clearError();

    try {
      await signIn(credentials.email, credentials.password);
      onLogin();
      onClose();
      setCredentials({ email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "microsoft"
  ) => {
    setIsLoading(true);
    setError("");
    clearError();

    try {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "facebook":
          await signInWithFacebook();
          break;
        case "microsoft":
          await signInWithMicrosoft();
          break;
      }
      onLogin();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error al iniciar sesión con ${provider}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setError("");
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-title">
            <FaSignInAlt className="auth-icon" />
            <h2>{t("auth.loginTitle")}</h2>
          </div>
          <button className="auth-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FaUser className="input-icon" />
                {t("auth.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder={t("auth.emailPlaceholder")}
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                {t("auth.password")}
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  {t("auth.loggingIn")}
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  {t("auth.loginButton")}
                </>
              )}
            </button>

            {/* Separador */}
            <div className="auth-divider">
              <span>{t("auth.or")}</span>
            </div>

            {/* Botones de autenticación social */}
            <div className="social-auth-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <FaGoogle />
                {t("auth.continueWithGoogle")}
              </button>

              <button
                type="button"
                className="social-btn facebook-btn"
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
              >
                <FaFacebook />
                {t("auth.continueWithFacebook")}
              </button>

              <button
                type="button"
                className="social-btn microsoft-btn"
                onClick={() => handleSocialLogin("microsoft")}
                disabled={isLoading}
              >
                <FaMicrosoft />
                Continuar con Microsoft
              </button>
            </div>
          </form>

          <div className="auth-info">
            <div className="auth-help">
              <h4>¿Necesitas ayuda?</h4>
              <p>
                Si tienes problemas para iniciar sesión, contacta con nuestro
                soporte técnico.
              </p>
            </div>
          </div>

          {onShowRegister && (
            <div className="auth-switch">
              <p>{t("auth.noAccount")}</p>
              <button
                className="auth-switch-btn"
                onClick={() => {
                  onClose();
                  onShowRegister();
                }}
              >
                {t("auth.createNewAccount")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
