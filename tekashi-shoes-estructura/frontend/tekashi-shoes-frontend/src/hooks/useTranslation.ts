import { useTranslation as useI18nTranslation } from "react-i18next";
import { useCallback } from "react";

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);

  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
      // Guardar preferencia en localStorage
      localStorage.setItem("preferred-language", language);
    },
    [i18n]
  );

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n.language]);

  const getAvailableLanguages = useCallback(() => {
    return [
      { code: "es", name: "Español", flag: "🇪🇸" },
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "pt", name: "Português", flag: "🇧🇷" },
    ];
  }, []);

  const isRTL = useCallback(() => {
    // Por ahora, todos los idiomas soportados son LTR
    return false;
  }, []);

  const formatCurrency = useCallback(
    (amount: number, currency: string = "COP") => {
      const locale =
        i18n.language === "es"
          ? "es-CO"
          : i18n.language === "en"
          ? "en-US"
          : i18n.language === "fr"
          ? "fr-FR"
          : i18n.language === "pt"
          ? "pt-BR"
          : "es-CO";

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount);
    },
    [i18n.language]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const locale =
        i18n.language === "es"
          ? "es-CO"
          : i18n.language === "en"
          ? "en-US"
          : i18n.language === "fr"
          ? "fr-FR"
          : i18n.language === "pt"
          ? "pt-BR"
          : "es-CO";

      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      return new Intl.DateTimeFormat(locale, {
        ...defaultOptions,
        ...options,
      }).format(dateObj);
    },
    [i18n.language]
  );

  const formatNumber = useCallback(
    (number: number, options?: Intl.NumberFormatOptions) => {
      const locale =
        i18n.language === "es"
          ? "es-CO"
          : i18n.language === "en"
          ? "en-US"
          : i18n.language === "fr"
          ? "fr-FR"
          : i18n.language === "pt"
          ? "pt-BR"
          : "es-CO";

      return new Intl.NumberFormat(locale, options).format(number);
    },
    [i18n.language]
  );

  const formatRelativeTime = useCallback(
    (date: Date | string) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - dateObj.getTime()) / 1000
      );

      const rtf = new Intl.RelativeTimeFormat(i18n.language, {
        numeric: "auto",
      });

      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
      } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
      } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
      } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
      }
    },
    [i18n.language]
  );

  const pluralize = useCallback(
    (key: string, count: number) => {
      // Usar la funcionalidad de pluralización de i18next
      return t(key, { count });
    },
    [t]
  );

  const interpolate = useCallback(
    (key: string, values: Record<string, any>) => {
      return t(key, values);
    },
    [t]
  );

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isRTL,
    formatCurrency,
    formatDate,
    formatNumber,
    formatRelativeTime,
    pluralize,
    interpolate,
    language: i18n.language,
    isReady: i18n.isInitialized,
  };
};

// Hook específico para traducciones de productos
export const useProductTranslation = () => {
  const { t, formatCurrency } = useTranslation();

  const translateProduct = useCallback((product: any, field: string) => {
    const currentLang = localStorage.getItem("preferred-language") || "es";

    // Si el producto tiene traducciones, usar la del idioma actual
    if (
      product.traducciones &&
      product.traducciones[currentLang] &&
      product.traducciones[currentLang][field]
    ) {
      return product.traducciones[currentLang][field];
    }

    // Fallback al campo original
    return product[field] || "";
  }, []);

  const formatProductPrice = useCallback(
    (price: number, discount?: number) => {
      if (discount && discount > 0) {
        const discountedPrice = price * (1 - discount / 100);
        return {
          original: formatCurrency(price),
          discounted: formatCurrency(discountedPrice),
          discount: `${discount}%`,
        };
      }
      return {
        original: formatCurrency(price),
        discounted: null,
        discount: null,
      };
    },
    [formatCurrency]
  );

  const translateGender = useCallback(
    (gender: string) => {
      return t(`genders.${gender.toLowerCase()}`);
    },
    [t]
  );

  const translateSeason = useCallback(
    (season: string) => {
      return t(`seasons.${season.toLowerCase()}`);
    },
    [t]
  );

  const translateAge = useCallback(
    (age: string) => {
      return t(`ages.${age.toLowerCase()}`);
    },
    [t]
  );

  return {
    translateProduct,
    formatProductPrice,
    translateGender,
    translateSeason,
    translateAge,
  };
};

// Hook para traducciones de navegación
export const useNavigationTranslation = () => {
  const { t } = useTranslation();

  const getNavigationItems = useCallback(() => {
    return [
      { key: "home", label: t("home"), path: "/" },
      { key: "products", label: t("products"), path: "/products" },
      { key: "about", label: t("about"), path: "/about" },
      { key: "contact", label: t("contact"), path: "/contact" },
    ];
  }, [t]);

  const getAuthItems = useCallback(() => {
    return [
      { key: "login", label: t("login"), path: "/login" },
      { key: "register", label: t("register"), path: "/register" },
    ];
  }, [t]);

  const getProfileItems = useCallback(() => {
    return [
      { key: "profile", label: t("profile"), path: "/profile" },
      { key: "favorites", label: t("favorites"), path: "/favorites" },
      { key: "wishlist", label: t("wishlist"), path: "/wishlist" },
      { key: "logout", label: t("logout"), action: "logout" },
    ];
  }, [t]);

  return {
    getNavigationItems,
    getAuthItems,
    getProfileItems,
  };
};

// Hook para traducciones de formularios
export const useFormTranslation = () => {
  const { t } = useTranslation();

  const getValidationMessages = useCallback(() => {
    return {
      required: t("fieldRequired"),
      email: t("invalidEmail"),
      minLength: (_min: number) => t("passwordTooShort"),
      passwordMatch: t("passwordsDoNotMatch"),
    };
  }, [t]);

  const getFormLabels = useCallback(() => {
    return {
      name: t("name"),
      email: t("email"),
      password: t("password"),
      confirmPassword: t("confirmPassword"),
      phone: t("phone"),
      address: t("address"),
    };
  }, [t]);

  return {
    getValidationMessages,
    getFormLabels,
  };
};
