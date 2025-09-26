import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/AdminHeader.css";

interface AdminHeaderProps {
  onClose?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onClose }) => {
  const handleCloseAdminPanel = () => {
    if (onClose) {
      onClose();
    } else {
      // Fallback: redirigir al home
      window.location.href = "/";
    }
  };

  return (
    <div className="admin-header">
      <div className="admin-header-actions">
        {/* Botón de cerrar panel */}
        <button
          className="close-admin-panel-btn"
          onClick={handleCloseAdminPanel}
          title="Cerrar panel de administración"
          aria-label="Cerrar panel de administración"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
