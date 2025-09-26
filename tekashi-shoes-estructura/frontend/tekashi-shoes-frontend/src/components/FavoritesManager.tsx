import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaStar,
  FaTrash,
  FaEye,
  FaShoppingCart,
  FaSpinner,
  FaMinus,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { dashboardService, Favorite } from "../services/DashboardService";
import { cartService } from "../services/CartService";
import { authService } from "../services/AuthService";

interface FavoritesManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showCreateWishlist, setShowCreateWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = async () => {
    setLoading(true);
    setError("");

    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setError("Debes iniciar sesión para ver tus favoritos");
        return;
      }

      const favoritesData = await dashboardService.getFavorites(
        String(user.id)
      );
      setFavorites(favoritesData);
    } catch (err) {
      setError("Error cargando favoritos");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      await dashboardService.removeFromFavorites(String(user.id), productId);
      setFavorites(favorites.filter((fav) => fav.productId !== productId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
  };

  const handleToggleSelection = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === favorites.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(favorites.map((fav) => fav.productId));
    }
  };

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim() || selectedProducts.length === 0) return;

    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // Crear la wishlist
      const wishlist = await dashboardService.createWishlist(
        String(user.id),
        newWishlistName,
        newWishlistDescription
      );

      // Agregar productos seleccionados a la wishlist
      for (const productId of selectedProducts) {
        await dashboardService.addToWishlist(wishlist.id, productId);
      }

      // Limpiar selección y formulario
      setSelectedProducts([]);
      setNewWishlistName("");
      setNewWishlistDescription("");
      setShowCreateWishlist(false);
    } catch (err) {
      console.error("Error creating wishlist:", err);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      for (const productId of selectedProducts) {
        await dashboardService.removeFromFavorites(String(user.id), productId);
      }

      setFavorites(
        favorites.filter((fav) => !selectedProducts.includes(fav.productId))
      );
      setSelectedProducts([]);
    } catch (err) {
      console.error("Error removing selected favorites:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="favorites-overlay">
      <div className="favorites-modal">
        <div className="favorites-header">
          <div className="header-content">
            <h2>
              <FaHeart />
              Mis Favoritos
            </h2>
            <div className="favorites-count">{favorites.length} productos</div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="favorites-content">
          {loading && (
            <div className="loading-state">
              <FaSpinner className="spinning" />
              <p>Cargando favoritos...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={loadFavorites} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <FaHeart className="empty-icon" />
                  <h3>No tienes favoritos aún</h3>
                  <p>
                    Agrega productos a tus favoritos haciendo clic en el corazón
                    mientras navegas por la tienda
                  </p>
                </div>
              ) : (
                <>
                  {/* Actions Bar */}
                  <div className="actions-bar">
                    <div className="selection-info">
                      <label className="select-all-label">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length === favorites.length &&
                            favorites.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                        <span>
                          Seleccionar todo ({selectedProducts.length})
                        </span>
                      </label>
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className="bulk-actions">
                        <button
                          className="bulk-btn create-wishlist-btn"
                          onClick={() => setShowCreateWishlist(true)}
                        >
                          <FaStar />
                          Crear Lista de Deseos
                        </button>
                        <button
                          className="bulk-btn remove-btn"
                          onClick={handleRemoveSelected}
                        >
                          <FaTrash />
                          Eliminar Seleccionados
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Create Wishlist Modal */}
                  {showCreateWishlist && (
                    <div className="create-wishlist-modal">
                      <div className="modal-header">
                        <h3>Crear Lista de Deseos</h3>
                        <button
                          className="close-btn"
                          onClick={() => setShowCreateWishlist(false)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="modal-content">
                        <div className="form-group">
                          <label>Nombre de la lista</label>
                          <input
                            type="text"
                            value={newWishlistName}
                            onChange={(e) => setNewWishlistName(e.target.value)}
                            placeholder="Mi lista de deseos"
                          />
                        </div>
                        <div className="form-group">
                          <label>Descripción (opcional)</label>
                          <textarea
                            value={newWishlistDescription}
                            onChange={(e) =>
                              setNewWishlistDescription(e.target.value)
                            }
                            placeholder="Describe tu lista..."
                            rows={3}
                          />
                        </div>
                        <div className="selected-products">
                          <h4>
                            Productos seleccionados ({selectedProducts.length})
                          </h4>
                          <div className="selected-list">
                            {selectedProducts.map((productId) => {
                              const favorite = favorites.find(
                                (fav) => fav.productId === productId
                              );
                              return favorite ? (
                                <div key={productId} className="selected-item">
                                  <span>
                                    {favorite.product?.nombre ||
                                      `Producto #${productId}`}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleToggleSelection(productId)
                                    }
                                    className="remove-selection"
                                  >
                                    <FaMinus />
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn-secondary"
                          onClick={() => setShowCreateWishlist(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn-primary"
                          onClick={handleCreateWishlist}
                          disabled={!newWishlistName.trim()}
                        >
                          <FaCheck />
                          Crear Lista
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Favorites Grid */}
                  <div className="favorites-grid">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className={`favorite-card ${
                          selectedProducts.includes(favorite.productId)
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div className="card-header">
                          <label className="selection-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(
                                favorite.productId
                              )}
                              onChange={() =>
                                handleToggleSelection(favorite.productId)
                              }
                            />
                          </label>
                          <button
                            className="remove-favorite-btn"
                            onClick={() =>
                              handleRemoveFavorite(favorite.productId)
                            }
                            title="Eliminar de favoritos"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="card-image">
                          <img
                            src={
                              favorite.product?.imagen ||
                              "/placeholder-shoe.jpg"
                            }
                            alt={favorite.product?.nombre || "Producto"}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-shoe.jpg";
                            }}
                          />
                        </div>

                        <div className="card-content">
                          <h3>
                            {favorite.product?.nombre ||
                              `Producto #${favorite.productId}`}
                          </h3>
                          <p className="product-brand">
                            {favorite.product?.marca}
                          </p>
                          <p className="product-price">
                            ${favorite.product?.precio?.toLocaleString() || "0"}
                          </p>
                          <p className="added-date">
                            Agregado el{" "}
                            {new Date(favorite.dateAdded).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="card-actions">
                          <button
                            className="action-btn view-btn"
                            title="Ver producto"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="action-btn cart-btn"
                            onClick={() => handleAddToCart(favorite.product)}
                            title="Agregar al carrito"
                          >
                            <FaShoppingCart />
                          </button>
                          <button
                            className="action-btn wishlist-btn"
                            title="Agregar a lista de deseos"
                          >
                            <FaStar />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesManager;
