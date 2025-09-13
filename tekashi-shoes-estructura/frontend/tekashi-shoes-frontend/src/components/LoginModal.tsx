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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-header">
          <div className="login-title">
            <FaSignInAlt className="login-icon" />
            <h2>Iniciar Sesión</h2>
          </div>
          <button className="login-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FaUser className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Contraseña
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

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-info">
            <div className="demo-accounts">
              <h4>Cuentas de demostración:</h4>
              <div className="demo-account">
                <FaShoppingBag className="demo-icon user" />
                <div>
                  <strong>Usuario:</strong> user@tekashi.com
                  <br />
                  <small>Contraseña: user123</small>
                </div>
              </div>
              <div className="demo-account">
                <FaUserShield className="demo-icon admin" />
                <div>
                  <strong>Admin:</strong> admin@tekashi.com
                  <br />
                  <small>Contraseña: admin456</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
