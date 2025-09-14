import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaUserPlus,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { authService } from "../services/AuthService";
import "../styles/UserDashboard.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "user" as "user" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Limpiar error al escribir
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }

    if (formData.name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }

    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("El email no es válido");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    // Validar teléfono si se proporciona
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      setError("El formato del teléfono no es válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Registrar usuario usando el método específico de registro
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
      });

      setSuccess(true);
      setError("");

      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onRegister();
        onClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          role: "user",
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      role: "user",
    });
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-header">
          <div className="login-title">
            <FaUserPlus className="login-icon" />
            <h2>Crear Cuenta</h2>
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
            {success && (
              <div className="login-success">
                <span>
                  ¡Cuenta creada exitosamente! 🎉
                  <br />
                  {formData.role === "user"
                    ? "Tienes 50 puntos de bienvenida"
                    : "Panel de administración disponible"}
                </span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="input-icon" />
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone className="input-icon" />
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+57 300 123 4567"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FaMapMarkerAlt className="input-icon" />
                Dirección (Opcional)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Tu dirección de envío"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <FaUser className="input-icon" />
                Tipo de Cuenta
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as "user" | "admin",
                  }))
                }
                disabled={isLoading}
                className="form-input"
              >
                <option value="user">
                  Usuario - Acceso completo a funcionalidades
                </option>
                <option value="admin">
                  Administrador - Panel de administración
                </option>
              </select>
              <small className="form-help">
                Los usuarios tienen acceso a dashboard personal, favoritos,
                listas de deseos, puntos de fidelidad y más.
              </small>
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
                  value={formData.password}
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

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock className="input-icon" />
                Confirmar Contraseña
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <FaUserPlus />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="login-info">
            <div className="demo-accounts">
              <h4>¿Ya tienes cuenta?</h4>
              <p>Inicia sesión con tus credenciales existentes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
