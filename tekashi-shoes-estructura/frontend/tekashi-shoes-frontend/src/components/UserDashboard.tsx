import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaBell,
  FaCog,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaGift,
  FaRocket,
  FaGem,
  FaFire,
  FaMagic,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaShare,
  FaLock,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import {
  dashboardService,
  DashboardStats,
  Purchase,
  Favorite,
  Wishlist,
  Notification,
} from "../services/DashboardService";
import { internationalizationService } from "../services/InternationalizationService";
import FavoritesManager from "./FavoritesManager";
import WishlistManager from "./WishlistManager";
import UserProfileModal from "./UserProfileModal";
import BeautifulAlert from "./BeautifulAlert";
import { useBeautifulAlert } from "../hooks/useBeautifulAlert";
import { useTranslation } from "../hooks/useTranslation";

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: string | number;
    uid?: string;
    email?: string;
    displayName?: string;
    [key: string]: any;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");
  const [showNewWishlistForm, setShowNewWishlistForm] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWishlists, setShowWishlists] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Hook para alertas bonitas
  const { alertState, showSuccess, showError, hideAlert } = useBeautifulAlert();

  // Hook para traducciones
  const { t } = useTranslation();

  // Función para obtener el nombre de la sección actual
  const getCurrentSectionName = () => {
    switch (activeTab) {
      case "overview":
        return t("userDashboard.overview");
      case "purchases":
        return t("userDashboard.purchases");
      case "favorites":
        return t("userDashboard.favorites");
      case "wishlists":
        return t("userDashboard.wishlists");
      case "notifications":
        return t("userDashboard.notifications");
      case "profile":
        return t("userDashboard.profile");
      default:
        return t("userDashboard.overview");
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      setCurrentUser(user);
      loadDashboardData();
    }
  }, [isOpen, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Usar uid de Firebase si está disponible, sino usar id
      const userId = user.uid || user.id;
      console.log("Cargando datos del dashboard para usuario:", userId);

      const [
        statsData,
        purchasesData,
        favoritesData,
        wishlistsData,
        notificationsData,
      ] = await Promise.all([
        dashboardService.getDashboardStats(String(userId)),
        dashboardService.getPurchaseHistory(String(userId)),
        dashboardService.getFavorites(String(userId)),
        dashboardService.getWishlists(String(userId)),
        dashboardService.getNotifications(String(userId)),
      ]);

      console.log("Datos cargados:", {
        stats: statsData,
        purchases: purchasesData,
        favorites: favoritesData,
        wishlists: wishlistsData,
        notifications: notificationsData,
      });

      setStats(statsData);
      setPurchases(purchasesData);
      setFavorites(favoritesData);
      setWishlists(wishlistsData);
      setNotifications(notificationsData);
    } catch (err) {
      setError(t("errorLoadingDashboard"));
      console.error("Error loading dashboard:", err);

      // Establecer datos vacíos en caso de error
      setStats({
        totalPurchases: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        userLevel: "Bronze",
        nextLevelPoints: 100,
        activeDiscount: "0%",
        favoriteCategories: [],
        recentActivity: [],
      });
      setPurchases([]);
      setFavorites([]);
      setWishlists([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    try {
      console.log("Removiendo favorito:", productId);
      await dashboardService.removeFromFavorites(String(user.id), productId);
      setFavorites(favorites.filter((fav) => fav.productId !== productId));
      console.log("Favorito removido exitosamente");
    } catch (err) {
      console.error("Error removing favorite:", err);
      showError("❌ Error", t("errorRemovingFavorite"));
    }
  };

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) {
      showError("❌ Campo Requerido", t("pleaseEnterListName"));
      return;
    }

    try {
      console.log("Creando lista de deseos:", newWishlistName);
      const newWishlist = await dashboardService.createWishlist(
        String(user.id),
        newWishlistName,
        newWishlistDescription
      );
      setWishlists([...wishlists, newWishlist]);
      setNewWishlistName("");
      setNewWishlistDescription("");
      setShowNewWishlistForm(false);
      console.log("Lista de deseos creada exitosamente");
      showSuccess("✅ Lista Creada", t("wishlistCreatedSuccessfully"));
    } catch (err) {
      console.error("Error creating wishlist:", err);
      showError("❌ Error", t("errorCreatingWishlist"));
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      console.log("Marcando notificación como leída:", notificationId);
      await dashboardService.markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      console.log("Notificación marcada como leída");
    } catch (err) {
      console.error("Error marking notification as read:", err);
      showError("❌ Error", t("errorMarkingNotification"));
    }
  };

  const handleProfileUpdated = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    console.log("Perfil actualizado:", updatedUser);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "shipped":
        return <FaTruck className="text-blue-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "delivered":
        return t("delivered");
      case "shipped":
        return t("shipped");
      case "pending":
        return t("pending");
      case "cancelled":
        return t("cancelled");
      default:
        return t("unknown");
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "offer":
        return <FaGift className="text-orange-500" />;
      case "order":
        return <FaTruck className="text-blue-500" />;
      case "new_product":
        return <FaRocket className="text-purple-500" />;
      case "loyalty":
        return <FaGem className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const tabs = [
    {
      id: "overview",
      label: t("userDashboard.overview"),
      icon: FaUser,
      description: t("userDashboard.overviewDescription"),
    },
    {
      id: "purchases",
      label: t("userDashboard.purchases"),
      icon: FaShoppingBag,
      description: t("userDashboard.purchasesDescription"),
    },
    {
      id: "favorites",
      label: t("userDashboard.favorites"),
      icon: FaHeart,
      description: t("userDashboard.favoritesDescription"),
    },
    {
      id: "wishlists",
      label: t("userDashboard.wishlists"),
      icon: FaStar,
      description: t("userDashboard.wishlistsDescription"),
    },
    {
      id: "notifications",
      label: t("userDashboard.notifications"),
      icon: FaBell,
      description: t("userDashboard.notificationsDescription"),
    },
    {
      id: "profile",
      label: t("userDashboard.profile"),
      icon: FaCog,
      description: t("userDashboard.profileDescription"),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="user-dashboard-overlay">
      <div className="user-dashboard">
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="user-avatar-large">
              <FaUser />
            </div>
            <div className="user-details">
              <h2>
                {t("userDashboard.welcome", { name: user?.name || t("user") })}
              </h2>
              <div className="current-section">
                <span className="section-name">{getCurrentSectionName()}</span>
              </div>
              <div className="user-badges">
                <span className="badge badge-bronze">
                  <FaGem />
                  {stats?.userLevel || "Bronze"}
                </span>
                <span className="badge badge-points">
                  <FaFire />
                  {stats?.loyaltyPoints || 0} {t("loyaltyPoints")}
                </span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <nav className="dashboard-nav">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`nav-item ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.description}
                  >
                    <div className="nav-item-content">
                      <Icon className="nav-icon" />
                      <div className="nav-text">
                        <span className="nav-label">{tab.label}</span>
                        <span className="nav-description">
                          {tab.description}
                        </span>
                      </div>
                      {tab.id === "notifications" &&
                        notifications.filter((n) => !n.isRead).length > 0 && (
                          <span className="notification-badge">
                            {notifications.filter((n) => !n.isRead).length}
                          </span>
                        )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="dashboard-main">
            {loading && (
              <div className="loading-spinner">
                <FaSpinner className="spinning" />
                <p>{t("loading")}</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={loadDashboardData} className="retry-btn">
                  {t("retry")}
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {activeTab === "overview" && stats && (
                  <div className="overview-section">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaShoppingBag />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalPurchases}</h3>
                          <p>{t("totalPurchases")}</p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaGem />
                        </div>
                        <div className="stat-content">
                          <h3>${stats.totalSpent.toLocaleString()}</h3>
                          <p>{t("totalSpent")}</p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaFire />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.loyaltyPoints}</h3>
                          <p>{t("loyaltyPoints")}</p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaMagic />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.activeDiscount}</h3>
                          <p>{t("activeDiscount")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="recent-activity">
                      <h3>{t("recentActivity")}</h3>
                      <div className="activity-list">
                        {stats.recentActivity.map((activity) => (
                          <div key={activity.id} className="activity-item">
                            <div className="activity-icon">
                              {activity.type === "purchase" && (
                                <FaShoppingBag />
                              )}
                              {activity.type === "review" && <FaStar />}
                              {activity.type === "favorite" && <FaHeart />}
                              {activity.type === "wishlist" && <FaStar />}
                            </div>
                            <div className="activity-content">
                              <p>{activity.description}</p>
                              <span className="activity-date">
                                {activity.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "purchases" && (
                  <div className="purchases-section">
                    <div className="section-header">
                      <h3>{t("purchaseHistory")}</h3>
                      <button className="export-btn">
                        <FaDownload />
                        {t("export")}
                      </button>
                    </div>
                    <div className="purchases-list">
                      {purchases.length === 0 ? (
                        <div className="empty-state">
                          <FaShoppingBag className="empty-icon" />
                          <h4>{t("noPurchasesYet")}</h4>
                          <p>{t("exploreCollection")}</p>
                        </div>
                      ) : (
                        purchases.map((purchase) => (
                          <div key={purchase.id} className="purchase-card">
                            <div className="purchase-header">
                              <div className="purchase-info">
                                <h4>Pedido #{purchase.invoiceNumber}</h4>
                                <span className="purchase-date">
                                  {purchase.date}
                                </span>
                              </div>
                              <div className="purchase-status">
                                {getStatusIcon(purchase.status)}
                                <span>{getStatusText(purchase.status)}</span>
                              </div>
                            </div>
                            <div className="purchase-details">
                              <p>
                                <strong>Total:</strong> $
                                {purchase.total.toLocaleString()}
                              </p>
                              {purchase.tracking && (
                                <p>
                                  <strong>Tracking:</strong> {purchase.tracking}
                                </p>
                              )}
                            </div>
                            <div className="purchase-actions">
                              <button className="action-btn">
                                <FaEye />
                                {t("viewDetails")}
                              </button>
                              <button className="action-btn">
                                <FaDownload />
                                {t("invoice")}
                              </button>
                              {purchase.status === "shipped" && (
                                <button className="action-btn">
                                  <FaTruck />
                                  {t("track")}
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "favorites" && (
                  <div className="favorites-section">
                    <div className="section-header">
                      <h3>{t("myFavorites")}</h3>
                      <div className="header-actions">
                        <button
                          className="manage-btn"
                          onClick={() => setShowFavorites(true)}
                        >
                          <FaEye />
                          {t("manage")}
                        </button>
                        <button className="share-btn">
                          <FaShare />
                          {t("share")}
                        </button>
                      </div>
                    </div>
                    <div className="favorites-grid">
                      {favorites.length === 0 ? (
                        <div className="empty-state">
                          <FaHeart className="empty-icon" />
                          <h4>{t("noFavoritesYet")}</h4>
                          <p>{t("addToFavorites")}</p>
                        </div>
                      ) : (
                        favorites.map((favorite) => (
                          <div key={favorite.id} className="favorite-card">
                            <div className="favorite-actions">
                              <button
                                className="remove-btn"
                                onClick={() =>
                                  handleRemoveFavorite(favorite.productId)
                                }
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="favorite-info">
                              <h4>Producto #{favorite.productId}</h4>
                              <p>Agregado el {favorite.dateAdded}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "wishlists" && (
                  <div className="wishlists-section">
                    <div className="section-header">
                      <h3>{t("wishlists")}</h3>
                      <div className="header-actions">
                        <button
                          className="manage-btn"
                          onClick={() => setShowWishlists(true)}
                        >
                          <FaEye />
                          {t("manage")}
                        </button>
                        <button
                          className="create-btn"
                          onClick={() =>
                            setShowNewWishlistForm(!showNewWishlistForm)
                          }
                        >
                          <FaPlus />
                          {t("newList")}
                        </button>
                      </div>
                    </div>

                    {showNewWishlistForm && (
                      <div className="new-wishlist-form">
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder={t("listName")}
                            value={newWishlistName}
                            onChange={(e) => setNewWishlistName(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            placeholder={t("descriptionOptional")}
                            value={newWishlistDescription}
                            onChange={(e) =>
                              setNewWishlistDescription(e.target.value)
                            }
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            onClick={handleCreateWishlist}
                            className="btn-primary"
                          >
                            {t("createList")}
                          </button>
                          <button
                            onClick={() => setShowNewWishlistForm(false)}
                            className="btn-secondary"
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="wishlists-grid">
                      {wishlists.map((wishlist) => (
                        <div key={wishlist.id} className="wishlist-card">
                          <div className="wishlist-header">
                            <h4>{wishlist.name}</h4>
                            <div className="wishlist-actions">
                              <button className="action-btn">
                                <FaEdit />
                              </button>
                              <button className="action-btn">
                                <FaShare />
                              </button>
                              <button className="action-btn">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          {wishlist.description && (
                            <p className="wishlist-description">
                              {wishlist.description}
                            </p>
                          )}
                          <div className="wishlist-stats">
                            <span>
                              {wishlist.products.length} {t("products")}
                            </span>
                            <span>•</span>
                            <span>
                              {t("created")} {wishlist.createdAt}
                            </span>
                          </div>
                          <div className="wishlist-visibility">
                            {wishlist.isPublic ? (
                              <span className="public">
                                <FaEye />
                                {t("public")}
                              </span>
                            ) : (
                              <span className="private">
                                <FaLock />
                                {t("private")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="notifications-section">
                    <div className="section-header">
                      <h3>{t("notifications")}</h3>
                      <button className="mark-all-read-btn">
                        {t("markAllAsRead")}
                      </button>
                    </div>
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-card ${
                            !notification.isRead ? "unread" : ""
                          }`}
                          onClick={() =>
                            handleMarkNotificationAsRead(notification.id)
                          }
                        >
                          <div className="notification-icon">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-date">
                              {notification.date}
                            </span>
                          </div>
                          {!notification.isRead && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="profile-section">
                    <div className="section-header">
                      <h3>{t("myProfile")}</h3>
                      <button
                        className="manage-btn"
                        onClick={() => setShowProfileModal(true)}
                      >
                        <FaEdit />
                        {t("manageProfile")}
                      </button>
                    </div>
                    <div className="profile-preview">
                      <div className="profile-info">
                        <div className="profile-avatar">
                          <FaUser className="avatar-icon" />
                        </div>
                        <div className="profile-details">
                          <h4>{currentUser?.name || t("user")}</h4>
                          <p>{currentUser?.email || t("notSpecified")}</p>
                          <span className="user-level">
                            {stats?.userLevel || "Bronze"}
                          </span>
                        </div>
                      </div>
                      <div className="profile-stats">
                        <div className="stat-item">
                          <span className="stat-label">
                            {t("loyaltyPoints")}
                          </span>
                          <span className="stat-value">
                            {stats?.loyaltyPoints || 0} {t("points")}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">
                            {t("totalPurchases")}
                          </span>
                          <span className="stat-value">
                            {stats?.totalPurchases || 0}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">{t("totalAmount")}</span>
                          <span className="stat-value">
                            {internationalizationService.formatCurrency(
                              stats?.totalSpent || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="profile-actions">
                      <button
                        className="btn-primary"
                        onClick={() => setShowProfileModal(true)}
                      >
                        <FaEdit />
                        {t("editCompleteProfile")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Favorites Manager Modal */}
      <FavoritesManager
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />

      {/* Wishlist Manager Modal */}
      <WishlistManager
        isOpen={showWishlists}
        onClose={() => setShowWishlists(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onProfileUpdated={handleProfileUpdated}
      />

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

export default UserDashboard;
