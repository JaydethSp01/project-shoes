import { useTranslation } from "react-i18next";

/**
 * Servicio para traducir nombres de categorías de productos
 * Mapea los nombres que vienen de la base de datos a traducciones locales
 */
export const useCategoryTranslator = () => {
  const { t } = useTranslation();

  /**
   * Traduce el nombre de una categoría de producto
   * @param categoryName - Nombre de la categoría que viene de la base de datos
   * @returns Nombre traducido según el idioma actual
   */
  const translateCategory = (categoryName: string): string => {
    // Mapeo de nombres de categorías de la BD a claves de traducción
    const categoryMap: Record<string, string> = {
      // Categorías comunes en español
      "Tenis Deportivos": "products.sportsSneakers",
      "Zapatillas Casuales": "products.casualSneakers",
      Tacones: "products.heels",
      Botas: "products.boots",
      Mocasines: "products.loafers",
      Zapatillas: "products.sneakers",
      "Zapatos Formales": "products.formalShoes",
      Sandalias: "products.sandals",
      "Zapatos de Cuero": "products.leatherShoes",
      "Zapatos Deportivos": "products.sportsShoes",
      "Zapatos Casuales": "products.casualShoes",

      // Categorías en inglés (por si vienen de la BD en inglés)
      "Sports Sneakers": "products.sportsSneakers",
      "Casual Sneakers": "products.casualSneakers",
      Heels: "products.heels",
      Boots: "products.boots",
      Loafers: "products.loafers",
      Sneakers: "products.sneakers",
      "Formal Shoes": "products.formalShoes",
      Sandals: "products.sandals",
      "Leather Shoes": "products.leatherShoes",
      "Sports Shoes": "products.sportsShoes",
      "Casual Shoes": "products.casualShoes",

      // Categorías en francés
      "Sneakers Sportifs": "products.sportsSneakers",
      "Sneakers Décontractés": "products.casualSneakers",
      Talons: "products.heels",
      Bottes: "products.boots",
      Mocassins: "products.loafers",
      "Chaussures Formelles": "products.formalShoes",
      Sandales: "products.sandals",
      "Chaussures en Cuir": "products.leatherShoes",
      "Chaussures de Sport": "products.sportsShoes",
      "Chaussures Décontractées": "products.casualShoes",

      // Categorías en portugués
      "Tênis Esportivos": "products.sportsSneakers",
      "Tênis Casuais": "products.casualSneakers",
      Saltos: "products.heels",
      Botas: "products.boots",
      Mocassins: "products.loafers",
      "Sapatos Formais": "products.formalShoes",
      Sandálias: "products.sandals",
      "Sapatos de Couro": "products.leatherShoes",
      "Sapatos Esportivos": "products.sportsShoes",
      "Sapatos Casuais": "products.casualShoes",
    };

    // Buscar la clave de traducción
    const translationKey = categoryMap[categoryName];

    if (translationKey) {
      // Si encontramos una traducción, la usamos
      return t(translationKey);
    }

    // Si no encontramos traducción, devolvemos el nombre original
    console.warn(
      `No se encontró traducción para la categoría: ${categoryName}`
    );
    return categoryName;
  };

  return { translateCategory };
};

/**
 * Hook para usar el traductor de categorías
 */
export const useCategoryTranslation = () => {
  return useCategoryTranslator();
};
