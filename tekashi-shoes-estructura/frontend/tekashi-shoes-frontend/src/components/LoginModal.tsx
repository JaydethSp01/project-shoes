import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSignInAlt,
  FaUserShield,
  FaShoppingBag,
} from "react-icons/fa";
import { authService, LoginCredentials } from "../services/AuthService";
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
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hook para traducciones
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

    try {
      await authService.login(credentials);
      onLogin();
      onClose();
      setCredentials({ email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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
          </form>

          <div className="auth-info">
            <div className="demo-accounts">
              <h4>{t("auth.demoAccounts")}</h4>
              <div className="demo-account">
                <FaShoppingBag className="demo-icon user" />
                <div>
                  <strong>{t("auth.user")}:</strong> user@tekashi.com
                  <br />
                  <small>{t("auth.password")}: user123</small>
                </div>
              </div>
              <div className="demo-account">
                <FaUserShield className="demo-icon admin" />
                <div>
                  <strong>{t("auth.admin")}:</strong> admin@tekashi.com
                  <br />
                  <small>{t("auth.password")}: admin456</small>
                </div>
              </div>
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
