import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaShoppingCart,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaHeart,
  FaShare,
  FaCopy,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { dashboardService, Wishlist } from "../services/DashboardService";
import { cartService } from "../services/CartService";
import { authService } from "../services/AuthService";

interface WishlistManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistManager: React.FC<WishlistManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadWishlists();
    }
  }, [isOpen]);

  const loadWishlists = async () => {
    setLoading(true);
    setError("");

    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setError("Debes iniciar sesión para ver tus listas de deseos");
        return;
      }

      const wishlistsData = await dashboardService.getWishlists(user.id);
      setWishlists(wishlistsData);
    } catch (err) {
      setError("Error cargando listas de deseos");
      console.error("Error loading wishlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async () => {
    if (!formData.name.trim()) return;

    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      const newWishlist = await dashboardService.createWishlist(
        user.id,
        formData.name,
        formData.description
      );

      setWishlists([...wishlists, newWishlist]);
      setFormData({ name: "", description: "" });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating wishlist:", err);
    }
  };

  const handleEditWishlist = async () => {
    if (!editingWishlist || !formData.name.trim()) return;

    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // Actualizar la wishlist
      const updatedWishlist = {
        ...editingWishlist,
        name: formData.name,
        description: formData.description,
      };

      setWishlists(
        wishlists.map((w) =>
          w.id === editingWishlist.id ? updatedWishlist : w
        )
      );

      if (selectedWishlist?.id === editingWishlist.id) {
        setSelectedWishlist(updatedWishlist);
      }

      setFormData({ name: "", description: "" });
      setEditingWishlist(null);
      setShowEditModal(false);
    } catch (err) {
      console.error("Error editing wishlist:", err);
    }
  };

  const handleDeleteWishlist = async (wishlistId: number) => {
    if (
      !confirm("¿Estás seguro de que quieres eliminar esta lista de deseos?")
    ) {
      return;
    }

    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // Aquí deberías llamar al servicio para eliminar la wishlist
      // await dashboardService.deleteWishlist(wishlistId);

      setWishlists(wishlists.filter((w) => w.id !== wishlistId));
      if (selectedWishlist?.id === wishlistId) {
        setSelectedWishlist(null);
      }
    } catch (err) {
      console.error("Error deleting wishlist:", err);
    }
  };

  const handleRemoveFromWishlist = async (
    wishlistId: number,
    productId: number
  ) => {
    try {
      // Aquí deberías llamar al servicio para remover el producto
      // await dashboardService.removeFromWishlist(wishlistId, productId);

      setWishlists(
        wishlists.map((wishlist) => {
          if (wishlist.id === wishlistId) {
            return {
              ...wishlist,
              products: wishlist.products.filter((p) => p.id !== productId),
            };
          }
          return wishlist;
        })
      );

      if (selectedWishlist?.id === wishlistId) {
        setSelectedWishlist({
          ...selectedWishlist,
          products: selectedWishlist.products.filter((p) => p.id !== productId),
        });
      }
    } catch (err) {
      console.error("Error removing product from wishlist:", err);
    }
  };

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
  };

  const handleShareWishlist = (wishlist: Wishlist) => {
    const url = `${window.location.origin}/wishlist/${wishlist.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // Aquí podrías mostrar una notificación de éxito
      console.log("URL copiada al portapapeles");
    });
  };

  const openEditModal = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setFormData({
      name: wishlist.name,
      description: wishlist.description || "",
    });
    setShowEditModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-modal">
        <div className="wishlist-header">
          <div className="header-content">
            <h2>
              <FaStar />
              Mis Listas de Deseos
            </h2>
            <div className="wishlist-count">{wishlists.length} listas</div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="wishlist-content">
          {loading && (
            <div className="loading-state">
              <FaSpinner className="spinning" />
              <p>Cargando listas de deseos...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={loadWishlists} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {wishlists.length === 0 ? (
                <div className="empty-state">
                  <FaStar className="empty-icon" />
                  <h3>No tienes listas de deseos aún</h3>
                  <p>
                    Crea tu primera lista de deseos para organizar los productos
                    que te gustan
                  </p>
                  <button
                    className="create-first-btn"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <FaPlus />
                    Crear Primera Lista
                  </button>
                </div>
              ) : (
                <div className="wishlist-layout">
                  {/* Wishlist Sidebar */}
                  <div className="wishlist-sidebar">
                    <div className="sidebar-header">
                      <button
                        className="create-btn"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <FaPlus />
                        Nueva Lista
                      </button>
                    </div>

                    <div className="wishlist-list">
                      {wishlists.map((wishlist) => (
                        <div
                          key={wishlist.id}
                          className={`wishlist-item ${
                            selectedWishlist?.id === wishlist.id ? "active" : ""
                          }`}
                          onClick={() => setSelectedWishlist(wishlist)}
                        >
                          <div className="item-header">
                            <h4>{wishlist.name}</h4>
                            <div className="item-actions">
                              <button
                                className="action-btn edit-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(wishlist);
                                }}
                                title="Editar lista"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWishlist(wishlist.id);
                                }}
                                title="Eliminar lista"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p className="item-description">
                            {wishlist.description || "Sin descripción"}
                          </p>
                          <div className="item-stats">
                            <span className="product-count">
                              {wishlist.products.length} productos
                            </span>
                            <span className="created-date">
                              {new Date(
                                wishlist.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wishlist Content */}
                  <div className="wishlist-main">
                    {selectedWishlist ? (
                      <>
                        <div className="main-header">
                          <div className="header-info">
                            <h3>{selectedWishlist.name}</h3>
                            <p>
                              {selectedWishlist.description ||
                                "Sin descripción"}
                            </p>
                          </div>
                          <div className="header-actions">
                            <button
                              className="action-btn share-btn"
                              onClick={() =>
                                handleShareWishlist(selectedWishlist)
                              }
                              title="Compartir lista"
                            >
                              <FaShare />
                            </button>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => openEditModal(selectedWishlist)}
                              title="Editar lista"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </div>

                        <div className="products-section">
                          {selectedWishlist.products.length === 0 ? (
                            <div className="empty-products">
                              <FaHeart className="empty-icon" />
                              <h4>Esta lista está vacía</h4>
                              <p>
                                Agrega productos desde tus favoritos o mientras
                                navegas por la tienda
                              </p>
                            </div>
                          ) : (
                            <div className="products-grid">
                              {selectedWishlist.products.map((product) => (
                                <div key={product.id} className="product-card">
                                  <div className="card-image">
                                    <img
                                      src={
                                        product.imagen ||
                                        "/placeholder-shoe.jpg"
                                      }
                                      alt={product.nombre}
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/placeholder-shoe.jpg";
                                      }}
                                    />
                                    <button
                                      className="remove-btn"
                                      onClick={() =>
                                        handleRemoveFromWishlist(
                                          selectedWishlist.id,
                                          product.id
                                        )
                                      }
                                      title="Eliminar de la lista"
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>

                                  <div className="card-content">
                                    <h4>{product.nombre}</h4>
                                    <p className="product-brand">
                                      {product.marca}
                                    </p>
                                    <p className="product-price">
                                      ${product.precio?.toLocaleString() || "0"}
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
                                      onClick={() => handleAddToCart(product)}
                                      title="Agregar al carrito"
                                    >
                                      <FaShoppingCart />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="no-selection">
                        <FaStar className="empty-icon" />
                        <h3>Selecciona una lista</h3>
                        <p>
                          Elige una lista de deseos del panel lateral para ver
                          sus productos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Crear Nueva Lista</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: "", description: "" });
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre de la lista</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Mi lista de deseos"
                    maxLength={50}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción (opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe tu lista..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: "", description: "" });
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateWishlist}
                  disabled={!formData.name.trim()}
                >
                  <FaCheck />
                  Crear Lista
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Editar Lista</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingWishlist(null);
                    setFormData({ name: "", description: "" });
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre de la lista</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Mi lista de deseos"
                    maxLength={50}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción (opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe tu lista..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingWishlist(null);
                    setFormData({ name: "", description: "" });
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  onClick={handleEditWishlist}
                  disabled={!formData.name.trim()}
                >
                  <FaCheck />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistManager;
