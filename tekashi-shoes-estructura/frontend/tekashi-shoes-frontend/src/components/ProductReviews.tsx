import React, { useState, useEffect } from "react";
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown, FaTimes } from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import ProductImage from "./ProductImage";
import BeautifulAlert from "./BeautifulAlert";
import { useBeautifulAlert } from "../hooks/useBeautifulAlert";
import LoadingSpinner from "./LoadingSpinner";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { authService } from "../services/AuthService";
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
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Hook para alertas bonitas
  const { alertState, showError, hideAlert } = useBeautifulAlert();
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  // Cargar reviews desde el backend
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true);

        // Cargar reviews del producto
        const reviewsData = await ConexionApiBackend.obtenerReviewsProducto(
          product.idProducto,
          {
            pagina: 1,
            limite: 50,
            ordenar: "fecha",
            direccion: "desc",
          }
        );

        // Cargar estadísticas del producto
        const estadisticas =
          await ConexionApiBackend.obtenerEstadisticasReviewsProducto(
            product.idProducto
          );

        setReviews(reviewsData || []);
        setAverageRating(estadisticas.promedioCalificacion || 0);
        setRatingDistribution(
          estadisticas.distribucionCalificaciones || [0, 0, 0, 0, 0]
        );
      } catch (error) {
        console.error("Error al cargar reviews:", error);
        setReviews([]);
        setAverageRating(0);
        setRatingDistribution([0, 0, 0, 0, 0]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [product.idProducto]);

  const handleStarClick = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.userName || !newReview.comment || newReview.rating === 0) {
      showError(
        "❌ Campos Incompletos",
        "Por favor completa todos los campos antes de enviar tu reseña."
      );
      return;
    }

    try {
      // Obtener usuario autenticado
      const currentUser = authService.getCurrentUser();

      // Crear la review en el backend
      const reviewData = {
        productoId: product.idProducto,
        nombreUsuario: newReview.userName,
        emailUsuario: currentUser?.email || "usuario@example.com",
        calificacion: newReview.rating,
        titulo: "", // Opcional
        comentario: newReview.comment,
      };

      const response = await ConexionApiBackend.crearReview(reviewData);

      if (response.success) {
        // Recargar reviews y estadísticas
        const reviewsData = await ConexionApiBackend.obtenerReviewsProducto(
          product.idProducto,
          {
            pagina: 1,
            limite: 50,
            ordenar: "fecha",
            direccion: "desc",
          }
        );

        const estadisticas =
          await ConexionApiBackend.obtenerEstadisticasReviewsProducto(
            product.idProducto
          );

        setReviews(reviewsData || []);
        setAverageRating(estadisticas.promedioCalificacion || 0);
        setRatingDistribution(
          estadisticas.distribucionCalificaciones || [0, 0, 0, 0, 0]
        );

        setNewReview({ userName: "", rating: 0, comment: "" });
        setShowReviewForm(false);

        showError(
          "✅ Reseña Enviada",
          "Tu reseña ha sido enviada exitosamente."
        );
      }
    } catch (error) {
      console.error("Error al enviar review:", error);
      showError(
        "❌ Error al Enviar",
        "Hubo un problema al enviar tu reseña. Por favor intenta de nuevo."
      );
    }
  };

  const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const response = await ConexionApiBackend.marcarReviewUtil(
        reviewId,
        isHelpful
      );

      if (response.success) {
        // Actualizar la review local con los nuevos valores
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  helpful: response.data.util,
                  notHelpful: response.data.noUtil,
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error al marcar review como útil:", error);
      showError(
        "❌ Error",
        "No se pudo marcar la reseña. Por favor intenta de nuevo."
      );
    }
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
              <p>
                <strong>Color:</strong> {product.color}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock} unidades disponibles
              </p>
              <p>
                <strong>ID:</strong> #{product.idProducto}
              </p>
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
            {isLoadingReviews ? (
              <LoadingSpinner size="medium" text="Cargando reseñas..." />
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
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
              ))
            ) : (
              <div className="no-reviews">
                <p>No hay reseñas disponibles para este producto.</p>
                <p>Sé el primero en escribir una reseña.</p>
              </div>
            )}
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

