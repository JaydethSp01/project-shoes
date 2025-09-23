import React from "react";
import "../styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text = "Cargando...",
  className = "",
}) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <div className="spinner-container">
        <div className="spinner modern"></div>
        {text && <p className="spinner-text pulse">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;

