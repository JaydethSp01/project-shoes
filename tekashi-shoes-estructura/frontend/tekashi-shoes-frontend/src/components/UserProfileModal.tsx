import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaEdit,
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import { authService } from "../services/AuthService";
import BeautifulAlert from "./BeautifulAlert";
import { useBeautifulAlert } from "../hooks/useBeautifulAlert";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/UserProfileModal.css";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated: (updatedUser: any) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hook para alertas bonitas
  const { alertState, showError, hideAlert } = useBeautifulAlert();

  // Hook para traducciones
  const { t } = useTranslation();

  useEffect(() => {
    if (user && isOpen) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://backend-ecommerce-6vi3.onrender.com/api/usuarios/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        onProfileUpdated(updatedUser);
        setSuccess("Perfil actualizado exitosamente");
        setIsEditing(false);

        // Actualizar el usuario en el AuthService
        authService.updateCurrentUser(updatedUser);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = prompt("Ingresa tu contraseña actual:");
    if (!currentPassword) return;

    const newPassword = prompt("Ingresa tu nueva contraseña:");
    if (!newPassword) return;

    const confirmPassword = prompt("Confirma tu nueva contraseña:");
    if (newPassword !== confirmPassword) {
      showError(
        "❌ Error de Validación",
        "Las contraseñas no coinciden. Por favor, intenta nuevamente."
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://backend-ecommerce-6vi3.onrender.com/api/usuarios/${user.id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Contraseña cambiada exitosamente");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-modal">
        <div className="profile-header">
          <h2>
            <FaUser className="profile-icon" />
            {t("myProfile")}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="profile-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message">
              <p>{success}</p>
            </div>
          )}

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  {t("name")}
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  placeholder={t("name")}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="input-icon" />
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  placeholder={t("auth.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaPhone className="input-icon" />
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaMapMarkerAlt className="input-icon" />
                  {t("city")}
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Bogotá"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>
                <FaMapMarkerAlt className="input-icon" />
                {t("address")}
              </label>
              <textarea
                value={profileData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                placeholder="Calle 123 #45-67, Barrio..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t("postalCode")}</label>
              <input
                type="text"
                value={profileData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                disabled={!isEditing}
                placeholder="110111"
              />
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit />
                Editar Perfil
              </button>
            ) : (
              <div className="editing-actions">
                <button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinning" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Guardar Cambios
                    </>
                  )}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setSuccess("");
                    // Resetear datos
                    setProfileData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      address: user.address || "",
                      city: user.city || "",
                      postalCode: user.postalCode || "",
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}

            <button
              className="password-btn"
              onClick={handleChangePassword}
              disabled={isLoading}
            >
              <FaLock />
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Beautiful Alert */}
      <BeautifulAlert
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
      />
    </div>
  );
};

export default UserProfileModal;
