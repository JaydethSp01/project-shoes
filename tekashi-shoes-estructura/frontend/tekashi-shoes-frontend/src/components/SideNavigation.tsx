import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaShoppingBag,
  FaComments,
  FaStar,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/SideNavigation.css";

interface SideNavigationProps {
  userRole?: "user" | "admin";
  currentPage?: string;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  userRole = "user",
  currentPage = "home",
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const userMenuItems = [
    { id: "home", label: t("home"), icon: FaHome, href: "/" },
    {
      id: "products",
      label: t("productsNav"),
      icon: FaShoppingBag,
      href: "#products",
    },
    {
      id: "testimonials",
      label: "Testimonios",
      icon: FaComments,
      href: "/testimonials",
    },
    {
      id: "features",
      label: "Características",
      icon: FaStar,
      href: "/features",
    },
    { id: "profile", label: t("profile"), icon: FaUser, href: "#profile" },
  ];

  const adminMenuItems = [
    { id: "home", label: t("home"), icon: FaHome, href: "/" },
    {
      id: "products",
      label: t("productsNav"),
      icon: FaShoppingBag,
      href: "#products",
    },
    {
      id: "testimonials",
      label: "Testimonios",
      icon: FaComments,
      href: "/testimonials",
    },
    {
      id: "features",
      label: "Características",
      icon: FaStar,
      href: "/features",
    },
    { id: "admin", label: t("admin"), icon: FaCog, href: "#admin" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems;

  const handleItemClick = (href: string) => {
    if (href.startsWith("#")) {
      // Scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to page
      window.location.href = href;
    }
  };

  return (
    <div className={`side-navigation ${isExpanded ? "expanded" : "collapsed"}`}>
      <button
        className="toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
      >
        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <nav className="side-nav">
        <div className="nav-header">
          <div className="nav-logo">
            <span className="logo-icon">👟</span>
            {isExpanded && <span className="logo-text">Tekashi</span>}
          </div>
        </div>

        <ul className="nav-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => handleItemClick(item.href)}
                  title={isExpanded ? item.label : item.label}
                >
                  <IconComponent className="nav-icon" />
                  {isExpanded && <span className="nav-text">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavigation;

