import React, { useState, useEffect } from "react";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/LanguageSelector.css";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const LanguageSelector: React.FC = () => {
  const { t, changeLanguage, getCurrentLanguage } = useTranslation();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);

  // Función para manejar clicks fuera del selector
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest(".language-selector")) {
      setIsOpen(false);
    }
  };

  // Inicializar las lenguas de forma estática para evitar problemas de hooks
  useEffect(() => {
    const langs: Language[] = [
      {
        code: "es",
        name: "Español",
        flag: "🇪🇸",
        nativeName: "Español",
      },
      {
        code: "en",
        name: "English",
        flag: "🇺🇸",
        nativeName: "English",
      },
      {
        code: "fr",
        name: "Français",
        flag: "🇫🇷",
        nativeName: "Français",
      },
      {
        code: "pt",
        name: "Português",
        flag: "🇵🇹",
        nativeName: "Português",
      },
    ];
    setLanguages(langs);
  }, []);

  useEffect(() => {
    if (languages.length === 0) return;

    // Obtener el idioma actual del localStorage
    const savedLang = localStorage.getItem("preferred-language") || "es";
    const lang = languages.find((l) => l.code === savedLang) || languages[0];
    setCurrentLanguage(lang);

    // Asegurar que i18n esté sincronizado
    if (savedLang !== getCurrentLanguage()) {
      changeLanguage(savedLang);
    }
  }, [languages, changeLanguage, getCurrentLanguage]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // No renderizar si no hay lenguas cargadas
  if (languages.length === 0 || !currentLanguage) {
    return (
      <div className="language-selector">
        <button
          className="language-selector-button"
          disabled
          style={{
            position: "relative",
            zIndex: 1001,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "8px 12px",
            color: "rgba(255, 255, 255, 0.8)",
            cursor: "not-allowed",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "120px",
          }}
        >
          <FaGlobe className="language-icon" />
          <span className="language-name">{t("loading")}</span>
        </button>
      </div>
    );
  }

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);

    // Cambiar el idioma usando el hook de traducción
    changeLanguage(language.code);

    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: language.code },
      })
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div
      className="language-selector"
      style={{
        position: "relative",
        display: "inline-block",
        zIndex: 1000,
      }}
    >
      <button
        className="language-selector-button"
        onClick={toggleDropdown}
        aria-label={t("additional.selectLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          position: "relative",
          zIndex: 1001,
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "8px 12px",
          color: "rgba(255, 255, 255, 0.8)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: "120px",
        }}
      >
        <FaGlobe className="language-icon" />
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-name">{currentLanguage.nativeName}</span>
        <FaChevronDown className={`chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="language-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            zIndex: 1002,
            minWidth: "200px",
          }}
        >
          <div
            className="language-dropdown-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              fontWeight: 600,
              color: "#4a5568",
              fontSize: "14px",
            }}
          >
            <FaGlobe className="dropdown-icon" />
            <span>{t("additional.selectLanguage")}</span>
          </div>

          <div className="language-list" style={{ padding: "8px 0" }}>
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${
                  currentLanguage.code === language.code ? "selected" : ""
                }`}
                onClick={() => handleLanguageChange(language)}
                aria-label={`Seleccionar idioma: ${language.nativeName}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  fontSize: "14px",
                  backgroundColor:
                    currentLanguage.code === language.code
                      ? "linear-gradient(135deg, #e6f0ff 0%, #d6e8ff 100%)"
                      : "transparent",
                  color:
                    currentLanguage.code === language.code
                      ? "#667eea"
                      : "#2d3748",
                }}
              >
                <span className="language-flag">{language.flag}</span>
                <div className="language-info">
                  <span className="language-native-name">
                    {language.nativeName}
                  </span>
                  <span className="language-english-name">{language.name}</span>
                </div>
                {currentLanguage.code === language.code && (
                  <FaCheck className="check-icon" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
