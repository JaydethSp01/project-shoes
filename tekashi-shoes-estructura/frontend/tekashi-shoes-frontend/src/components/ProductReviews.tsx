import React, { useState, useEffect } from "react";
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown, FaTimes } from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import ProductImage from "./ProductImage";
import BeautifulAlert from "./BeautifulAlert";
import { useBeautifulAlert } from "../hooks/useBeautifulAlert";
import "../styles/ProductReviews.css";

interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  images?: { [key: number]: string };
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  product,
  isOpen,
  onClose,
  images = {},
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Hook para alertas bonitas
  const { alertState, showSuccess, showError, hideAlert } = useBeautifulAlert();
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  // Generar reviews de ejemplo
  useEffect(() => {
    const sampleReviews: Review[] = [
      {
        id: "1",
        productId: product.idProducto,
        userName: "María González",
        rating: 5,
        comment:
          "Excelente calidad, muy cómodos y duraderos. Los recomiendo totalmente.",
        date: "2024-01-15",
        helpful: 12,
        notHelpful: 1,
        verified: true,
      },
      {
        id: "2",
        productId: product.idProducto,
        userName: "Carlos Rodríguez",
        rating: 4,
        comment:
          "Buen producto, se ajusta perfectamente. La entrega fue rápida.",
        date: "2024-01-10",
        helpful: 8,
        notHelpful: 0,
        verified: true,
      },
      {
        id: "3",
        productId: product.idProducto,
        userName: "Ana Martínez",
        rating: 5,
        comment: "Super cómodos, perfectos para el día a día. Calidad premium.",
        date: "2024-01-08",
        helpful: 15,
        notHelpful: 2,
        verified: false,
      },
      {
        id: "4",
        productId: product.idProducto,
        userName: "Luis Pérez",
        rating: 3,
        comment:
          "Están bien, pero esperaba un poco más de calidad por el precio.",
        date: "2024-01-05",
        helpful: 5,
        notHelpful: 3,
        verified: true,
      },
    ];

    setReviews(sampleReviews);

    // Calcular rating promedio
    const avg =
      sampleReviews.reduce((sum, review) => sum + review.rating, 0) /
      sampleReviews.length;
    setAverageRating(avg);

    // Calcular distribución de ratings
    const distribution = [0, 0, 0, 0, 0];
    sampleReviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    setRatingDistribution(distribution);
  }, [product.idProducto]);

  const handleStarClick = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.userName || !newReview.comment || newReview.rating === 0) {
      showError("❌ Campos Incompletos", "Por favor completa todos los campos antes de enviar tu reseña.");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      productId: product.idProducto,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
      notHelpful: 0,
      verified: false,
    };

    setReviews((prev) => [review, ...prev]);

    // Recalcular estadísticas
    const updatedReviews = [review, ...reviews];
    const avg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
      updatedReviews.length;
    setAverageRating(avg);

    const distribution = [0, 0, 0, 0, 0];
    updatedReviews.forEach((r) => {
      distribution[r.rating - 1]++;
    });
    setRatingDistribution(distribution);

    setNewReview({ userName: "", rating: 0, comment: "" });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpful: isHelpful ? review.helpful + 1 : review.helpful,
              notHelpful: !isHelpful
                ? review.notHelpful + 1
                : review.notHelpful,
            }
          : review
      )
    );
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${
              interactive ? "interactive" : ""
            }`}
            onClick={() => interactive && handleStarClick(star)}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="reviews-overlay" onClick={onClose}>
      <div className="reviews-container" onClick={(e) => e.stopPropagation()}>
        <div className="reviews-header">
          <h3>Reseñas de {product.marca}</h3>
          <button className="reviews-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="reviews-content">
          {/* Información del Producto */}
          <div className="product-info-section">
            <ProductImage
              marca={product.marca}
              imagenId={product.imagenId}
              images={images}
              className="product-info-image"
              alt={product.marca}
            />
            <div className="product-info-details">
              <h4>{product.marca}</h4>
              <p><strong>Color:</strong> {product.color}</p>
              <p><strong>Stock:</strong> {product.stock} unidades disponibles</p>
              <p><strong>ID:</strong> #{product.idProducto}</p>
              <div className="product-price">
                ${product.precio.toLocaleString()}
              </div>
            </div>
          </div>
          {/* Resumen de ratings */}
          <div className="rating-summary">
            <div className="rating-overview">
              <div className="average-rating">
                <span className="rating-number">
                  {averageRating.toFixed(1)}
                </span>
                {renderStars(Math.round(averageRating))}
                <span className="rating-count">({reviews.length} reseñas)</span>
              </div>
            </div>

            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}★</span>
                  <div className="rating-progress">
                    <div
                      className="rating-fill"
                      style={{
                        width: `${
                          reviews.length > 0
                            ? (ratingDistribution[rating - 1] /
                                reviews.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="rating-count">
                    {ratingDistribution[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón para agregar reseña */}
          <div className="add-review-section">
            <button
              className="add-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Escribir una reseña
            </button>
          </div>

          {/* Formulario de nueva reseña */}
          {showReviewForm && (
            <div className="review-form">
              <h4>Escribe tu reseña</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label>Tu nombre:</label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Calificación:</label>
                  {renderStars(newReview.rating, true)}
                </div>

                <div className="form-group">
                  <label>Tu comentario:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                    placeholder="Comparte tu experiencia con este producto..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit">Publicar reseña</button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de reseñas */}
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <FaUser className="user-icon" />
                    <div>
                      <span className="reviewer-name">{review.userName}</span>
                      {review.verified && (
                        <span className="verified-badge">✓ Verificado</span>
                      )}
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>

                <div className="review-content">
                  <p>{review.comment}</p>
                </div>

                <div className="review-actions">
                  <span>¿Te resultó útil esta reseña?</span>
                  <button
                    className="helpful-btn"
                    onClick={() => handleHelpful(review.id, true)}
                  >
                    <FaThumbsUp /> Sí ({review.helpful})
                  </button>
                  <button
                    className="not-helpful-btn"
                    onClick={() => handleHelpful(review.id, false)}
                  >
                    <FaThumbsDown /> No ({review.notHelpful})
                  </button>
                </div>
              </div>
            ))}
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

export default ProductReviews;

