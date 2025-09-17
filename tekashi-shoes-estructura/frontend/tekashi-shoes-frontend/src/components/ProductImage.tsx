import React, { useState } from "react";
import {
  FaShoePrints,
  FaRunning,
  FaFootballBall,
  FaBasketballBall,
} from "react-icons/fa";
import "../styles/ProductImage.css";

interface ProductImageProps {
  marca: string;
  imagenId?: number;
  images?: { [key: number]: string };
  className?: string;
  alt?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  marca,
  imagenId,
  images,
  className = "",
  alt = "Producto",
}) => {
  const [imageError, setImageError] = useState(false);

  // Función para obtener icono por marca
  const getBrandIcon = (marca: string) => {
    const brandIcons: { [key: string]: React.ReactNode } = {
      Nike: <FaRunning className="brand-icon" style={{ color: "#FF6B35" }} />,
      Adidas: (
        <FaFootballBall className="brand-icon" style={{ color: "#0066CC" }} />
      ),
      "Air Jordan": (
        <FaBasketballBall className="brand-icon" style={{ color: "#FF6B35" }} />
      ),
      Jordan: (
        <FaBasketballBall className="brand-icon" style={{ color: "#FF6B35" }} />
      ),
      Puma: <FaRunning className="brand-icon" style={{ color: "#FF6B35" }} />,
      "New Balance": (
        <FaShoePrints className="brand-icon" style={{ color: "#0066CC" }} />
      ),
      "Calvin Klein": (
        <FaShoePrints className="brand-icon" style={{ color: "#8B4513" }} />
      ),
      Asics: <FaRunning className="brand-icon" style={{ color: "#FF0000" }} />,
      Brooks: <FaRunning className="brand-icon" style={{ color: "#0066CC" }} />,
      Saucony: (
        <FaShoePrints className="brand-icon" style={{ color: "#FF6B35" }} />
      ),
      "Under Armour": (
        <FaFootballBall className="brand-icon" style={{ color: "#0066CC" }} />
      ),
      Converse: (
        <FaShoePrints className="brand-icon" style={{ color: "#000000" }} />
      ),
      Vans: (
        <FaShoePrints className="brand-icon" style={{ color: "#000000" }} />
      ),
      Reebok: <FaRunning className="brand-icon" style={{ color: "#FF0000" }} />,
      "New Era": (
        <FaShoePrints className="brand-icon" style={{ color: "#0066CC" }} />
      ),
    };

    // Buscar coincidencia parcial en la marca
    const brandKey = Object.keys(brandIcons).find((key) =>
      marca.toLowerCase().includes(key.toLowerCase())
    );

    return brandKey ? (
      brandIcons[brandKey]
    ) : (
      <FaShoePrints className="brand-icon" style={{ color: "#666666" }} />
    );
  };

  // Función para obtener imagen de BD o fallback
  const getImageSource = (): string | null => {
    // Si hay error en la imagen, usar icono
    if (imageError) return null;

    // Intentar usar imagen de BD si existe
    if (imagenId && images && images[imagenId]) {
      return `data:image/jpeg;base64,${images[imagenId]}`;
    }

    // Si no hay imagen de BD, retornar null para mostrar icono
    return null;
  };

  const imageSource = getImageSource();

  // Si hay imagen de BD, mostrarla
  if (imageSource) {
    return (
      <div className={`product-image-container ${className}`}>
        <img
          src={imageSource}
          alt={alt}
          className="product-image"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Si no hay imagen o hay error, mostrar icono de marca
  return (
    <div className={`product-icon-fallback ${className}`}>
      {getBrandIcon(marca)}
      <span className="brand-name">{marca}</span>
    </div>
  );
};

export default ProductImage;
