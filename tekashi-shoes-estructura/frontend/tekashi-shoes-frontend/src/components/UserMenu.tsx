import React, { useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaHeart,
  FaShoppingBag,
  FaHistory,
  FaGift,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

interface UserMenuProps {
  user: any;
  onLogout: () => void;
  onShowDashboard: () => void;
  onShowCart: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
  onShowAdminPanel: () => void;
  cartItemCount: number;
  cartTotal: number;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onShowDashboard,
  onShowCart,
  onShowLogin,
  onShowRegister,
  onShowAdminPanel,
  cartItemCount,
  cartTotal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const userMenuItems =
    user?.role === "admin"
      ? [
          {
            id: "admin",
            label: "Panel Admin",
            icon: FaCog,
            action: onShowAdminPanel,
            description: "Acceso al panel de administración",
          },
        ]
      : [
          {
            id: "dashboard",
            label: "Mi Panel",
            icon: FaUser,
            action: onShowDashboard,
            description:
              "Accede a tu dashboard personal con todas las opciones",
          },
        ];

  const navigationItems = [
    {
      id: "home",
      label: "Inicio",
      icon: FaHome,
      action: () =>
        document
          .querySelector(".hero-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "products",
      label: "Productos",
      icon: FaShoppingBag,
      action: () =>
        document
          .querySelector(".products-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "contact",
      label: "Contacto",
      icon: FaPhone,
      action: () =>
        document
          .querySelector(".footer")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  return (
    <>
      {/* Botón del menú móvil */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay del menú móvil */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Menú principal */}
      <div className={`user-menu ${isMenuOpen ? "active" : ""}`}>
        {/* Navegación principal */}
        <nav className="main-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="nav-item"
                onClick={item.action}
                title={item.label}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sección de usuario */}
        <div className="user-section">
          {user ? (
            <div className="authenticated-user">
              {/* Dropdown del usuario */}
              <div className="user-dropdown-container">
                <button
                  className="user-profile-btn"
                  onClick={toggleUserDropdown}
                >
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                  </div>
                  {isUserDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Dropdown menu */}
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          className="dropdown-item"
                          onClick={() => {
                            item.action();
                            setIsUserDropdownOpen(false);
                          }}
                        >
                          <Icon />
                          <div className="item-content">
                            <span className="item-label">{item.label}</span>
                            <span className="item-description">
                              {item.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={onLogout}>
                      <FaSignOutAlt />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="guest-user">
              <button className="btn-primary" onClick={onShowLogin}>
                <FaUser />
                Iniciar Sesión
              </button>
              <button className="btn-secondary" onClick={onShowRegister}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {isUserDropdownOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsUserDropdownOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserMenu;
