import {
  FaStar,
  FaHeart,
  FaEye,
  FaShoppingCart,
  FaCheck,
  FaEdit,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
// import ProductForm from "../componets/ProductForm";
// import { useProductForm } from "../hooks/useProductForm";
import Chatbot from "../components/Chatbot";
import GlobalAlert from "../components/GlobalAlert";
import { useGlobalAlert } from "../hooks/useGlobalAlert";
import LanguageSelector from "../components/LanguageSelector";
import ShoppingCart from "../components/ShoppingCart";
import AdvancedSearch from "../components/AdvancedSearch";
import ProductFilters from "../components/ProductFilters";
import CheckoutForm from "../components/CheckoutForm";
import ProductReviews from "../components/ProductReviews";
import Footer from "../components/Footer";
import NotificationSystem from "../components/NotificationSystem";
// import AlertSystem from "../components/AlertSystem";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import AdminPanel from "../components/AdminPanel";
import RealDashboard from "../components/RealDashboard";
import UserDashboard from "../components/UserDashboard";
import UserMenu from "../components/UserMenu";
import ProductImage from "../components/ProductImage";
import Pagination from "../components/Pagination";
import SimplifiedHeader from "../components/SimplifiedHeader";
import AdminHeader from "../components/AdminHeader";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { Product, TipoProducto } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { cartService } from "../services/CartService";
import { notificationService } from "../services/NotificationService";
import { useGeolocation } from "../hooks/useGeolocation";
import OnboardingModal from "../components/OnboardingModal";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/UserDashboard.css";
import "../styles/UserMenu.css";
import "../styles/AdminPanel.css";
import "../styles/AdvancedSearch.css";
import "../styles/ProductFilters.css";
import "../styles/CheckoutForm.css";
import "../styles/FavoritesManager.css";
import "../styles/WishlistManager.css";
import "../styles/Pagination.css";
import "../styles/LocationBanner.css";
import "../styles/ProductCards.css";
import "../styles/HomeAnimations.css";

const Home = () => {
  const { t } = useTranslation();
  const { alert, showError, showSuccess, hideAlert } = useGlobalAlert();

  // const {
  //   isEditing,
  //   selectedProduct,
  //   showModal,
  //   handleAddProduct,
  //   handleEditProduct,
  //   handleSubmit,
  //   handleCloseModal,
  //   products,
  //   images,
  //   handleDeleteProduct,
  //   handleFilterByType,
  // } = useProductForm();

  // Estados para productos e imágenes
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<{ [key: number]: string }>({});

  // Estados de loading
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  // Estados para funcionalidades
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState<Product | null>(null);
  const [selectedProductForManagement, setSelectedProductForManagement] =
    useState<Product | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user: currentUser, loading: authLoading, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showRealDashboard, setShowRealDashboard] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Estados para búsqueda avanzada
  // const [searchResults, setSearchResults] = useState<Product[]>([]);
  // const [totalSearchResults, setTotalSearchResults] = useState(0);

  // Hook para geolocalización
  const { location, getCurrentLocation } = useGeolocation();

  // Función para cargar productos con cache
  const loadProducts = useCallback(async () => {
    // Verificar si ya hay productos cargados
    if (products.length > 0) {
      return;
    }

    try {
      setIsLoadingProducts(true);
      const productos = await ConexionApiBackend.obtenerProductos();
      setProducts(productos);
    } catch (error) {
      console.error(t("additional.console.errorLoadingProducts"), error);
      // Mostrar mensaje de error al usuario
      console.error(t("additional.console.connectionError"));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [t, products.length]);

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Mostrar onboarding para nuevos usuarios
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("tekashi-onboarding-seen");
    if (!hasSeenOnboarding && products.length > 0) {
      setShowOnboarding(true);
    }
  }, [products]);

  // Obtener ubicación del usuario al cargar la página
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await getCurrentLocation();
      } catch (error) {
        console.log(t("additional.console.locationError"), error);
        // No es crítico si no se puede obtener la ubicación
      }
    };

    initializeLocation();
  }, [getCurrentLocation, t]);

  // Cargar imágenes de productos
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagenes = await ConexionApiBackend.obtenerImagenes();
        setImages(imagenes);
      } catch (error) {
        console.error(t("additional.console.errorLoadingImages"), error);
        // Continuar sin imágenes si hay error
        setImages({});
      }
    };
    loadImages();
  }, [t]);

  // Cargar tipos de producto
  useEffect(() => {
    const loadTipos = async () => {
      try {
        setIsLoadingTypes(true);
        const tipos = await ConexionApiBackend.obtenerTiposProducto();
        setTiposProducto(tipos);
      } catch (error) {
        console.error(t("additional.console.errorLoadingProductTypes"), error);
        // Continuar sin tipos si hay error
        setTiposProducto([]);
      } finally {
        setIsLoadingTypes(false);
      }
    };
    loadTipos();
  }, [t]);

  // Actualizar productos filtrados cuando cambien los productos
  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1); // Resetear a la primera página cuando cambien los productos
  }, [products]);

  // Actualizar contadores del carrito (sin cache)
  useEffect(() => {
    const updateCartCounters = () => {
      setCartItemCount(cartService.getItemCount());
      const summary = cartService.getCartSummary();
      setCartTotal(summary.total);
    };

    // Forzar actualización inicial para evitar cache
    cartService.forceUpdate();
    updateCartCounters();

    // Suscribirse a cambios del carrito
    const unsubscribe = cartService.subscribe(() => {
      updateCartCounters();
    });

    return unsubscribe;
  }, []);

  // El estado de autenticación se maneja ahora con useAuth hook

  // Cargar favoritos del usuario cuando se loguee
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (currentUser) {
        try {
          const userFavorites =
            await ConexionApiBackend.obtenerFavoritosUsuario({
              pagina: 1,
              limite: 100,
            });
          const favoriteIds = userFavorites.map(
            (fav: { productoId: number }) => fav.productoId
          );
          setFavorites(favoriteIds);
        } catch (error) {
          console.error(t("additional.console.errorLoadingFavorites"), error);
        }
      } else {
        setFavorites([]);
      }
    };

    loadUserFavorites();
  }, [currentUser, t]);

  // Función para manejar resultados de búsqueda
  const handleSearchResults = (products: Product[]) => {
    setFilteredProducts(products);
    setCurrentPage(1); // Resetear a la primera página en búsquedas
    // Scroll to products section
    document
      .querySelector(".products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Funciones para paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to products section
    document
      .querySelector(".products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Calcular productos para la página actual
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Función para manejar pedido completado
  const handleOrderComplete = (order: {
    id: string;
    total: number;
    status: string;
  }) => {
    console.log(t("additional.console.orderCompleted"), order);
    // Aquí podrías mostrar una notificación de éxito o redirigir a una página de confirmación
  };

  // Función para manejar gestión de productos
  const handleManageProduct = (product: Product) => {
    setSelectedProductForManagement(product);
    setShowAdminPanel(true);
  };

  // Mostrar siempre como usuario invitado por defecto
  // const isGuestMode = !currentUser;

  // Header con position: sticky - no necesita JavaScript

  const handleAddToCart = (product: Product) => {
    // El servicio del carrito maneja toda la lógica
    cartService.addToCart(product, 1);

    // Mostrar notificación de éxito
    // notificationService.showNotification(
    //   "success",
    //   "Producto agregado",
    //   `${product.marca} ha sido agregado al carrito`
    // );
  };

  const handleToggleFavorite = async (productId: number) => {
    const product = products.find((p) => p.idProducto === productId);
    if (!product || !currentUser) return;

    const isCurrentlyFavorite = favorites.includes(productId);

    try {
      if (isCurrentlyFavorite) {
        // Remover de favoritos
        await ConexionApiBackend.removerDeFavoritos(currentUser.id.toString());
        setFavorites((prev) => prev.filter((id) => id !== productId));
        notificationService.favoriteNotification(product.marca, false);
      } else {
        // Agregar a favoritos
        await ConexionApiBackend.agregarAFavoritos(productId.toString(), {
          notas: t("additional.favoriteAddedFromHome"),
          prioridad: 1,
          notificarOferta: true,
          notificarStock: true,
        });
        setFavorites((prev) => [...prev, productId]);
        notificationService.favoriteNotification(product.marca, true);
      }
    } catch (error) {
      console.error(t("additional.console.errorHandlingFavorites"), error);
      // Fallback: manejar localmente si falla la API
      setFavorites((prev) =>
        isCurrentlyFavorite
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
      notificationService.favoriteNotification(
        product.marca,
        !isCurrentlyFavorite
      );
    }
  };

  const handleViewReviews = (product: Product) => {
    setSelectedProductForReview(product);
    setShowReviews(true);
  };

  // Función para obtener imagen por marca (reemplazada por ProductImage component)
  // const getProductImageByBrand = (marca: string): string => {
  // const brandImages: { [key: string]: string } = {
  //   Nike: "/shoe1.jpg",
  //   Adidas: "/shoe2.jpg",
  //   "Air Jordan": "/shoe1.jpg",
  //   Jordan: "/shoe1.jpg",
  //   Puma: "/shoe3.jpg",
  //   Converse: "/shoe4.jpg",
  //   Vans: "/shoe5.jpg",
  //   "New Balance": "/shoe1.jpg",
  //   Reebok: "/shoe2.jpg",
  //   Gucci: "/shoe3.jpg",
  //   Balenciaga: "/shoe4.jpg",
  //   Yeezy: "/shoe5.jpg",
  //   "Tommy Hilfiger": "/shoe1.jpg",
  //   Lacoste: "/shoe2.jpg",
  //   "Ralph Lauren": "/shoe3.jpg",
  //   "Calvin Klein": "/shoe4.jpg",
  //   Asics: "/shoe5.jpg",
  //   Brooks: "/shoe1.jpg",
  //   Saucony: "/shoe2.jpg",
  //   "Under Armour": "/shoe3.jpg",
  // };

  // Buscar coincidencia parcial en la marca
  // const brandKey = Object.keys(brandImages).find((key) =>
  //   marca.toLowerCase().includes(key.toLowerCase())
  // );

  // return brandKey ? brandImages[brandKey] : "/shoe1.jpg";
  // };

  // Funciones para el onboarding
  const handleOnboardingNext = () => {
    setOnboardingStep((prev) => prev + 1);
  };

  const handleOnboardingPrevious = () => {
    setOnboardingStep((prev) => prev - 1);
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="ecommerce-container">
      {/* Global Alert */}
      <GlobalAlert alert={alert} onClose={hideAlert} />
      {/* Header Moderno */}
      <header className="modern-header">
        <div className="header-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="header-info">
                  <span>🚚 {t("header.freeShipping")}</span>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <div className="header-links">
                  <a href="#ayuda">{t("header.help")}</a>
                  <a href="#soporte">{t("header.support")}</a>
                  <a href="#contacto">{t("header.contact")}</a>
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="main-navbar">
          <div className="container">
            <div className="navbar-content">
              {/* Logo */}
              <div className="navbar-brand">
                <a href="#" className="brand-link">
                  <div className="logo-container">
                    <div className="logo-icon">👟</div>
                    <div className="logo-text">
                      <h1 className="brand-name">{t("header.brandName")}</h1>
                      <p className="brand-tagline">
                        {t("header.brandTagline")}
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Búsqueda removida del header - se usa la de abajo */}

              {/* Nuevo Sistema de Menú */}
              <UserMenu
                user={currentUser}
                onLogout={() => signOut()}
                onShowDashboard={() => {
                  if (currentUser?.role === "admin") {
                    setShowRealDashboard(true);
                  } else {
                    setShowUserDashboard(true);
                  }
                }}
                onShowCart={() => {
                  const cartElement = document.querySelector(
                    ".shopping-cart-container"
                  );
                  if (cartElement) {
                    cartElement.classList.add("active");
                  }
                }}
                onShowLogin={() => setShowLogin(true)}
                onShowRegister={() => setShowRegister(true)}
                onShowAdminPanel={() => setShowAdminPanel(true)}
                cartItemCount={cartItemCount}
                cartTotal={cartTotal}
              />

              {/* Header específico según el rol */}
              {!currentUser && (
                <SimplifiedHeader onCartOpen={() => setShowCart(true)} />
              )}
              {currentUser && currentUser.role !== "admin" && (
                <SimplifiedHeader onCartOpen={() => setShowCart(true)} />
              )}
              {currentUser && currentUser.role === "admin" && <AdminHeader />}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{t("hero.title")}</h1>
              <p className="hero-subtitle">{t("hero.subtitle")}</p>
              <div className="hero-buttons">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    document
                      .querySelector(".products-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("hero.viewCollection")}
                </button>
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => {
                    document
                      .querySelector(".offers-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("hero.specialOffers")}
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="/img-1.png"
                alt={t("additional.heroImage")}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y Categorías */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-header">
            <h2>{t("products.ourProducts")}</h2>
          </div>

          {/* Filtros Avanzados */}
          <ProductFilters
            onFilterChange={setFilteredProducts}
            allProducts={products}
          />

          {/* Categorías */}
          <div className="categories-nav">
            <button
              className={`category-btn ${
                selectedCategory === null ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(null);
                setFilteredProducts(products);
                setCurrentPage(1); // Resetear a la primera página
              }}
            >
              {t("products.all")}
            </button>
            {/* Eliminar duplicados de tipos de producto */}
            {isLoadingTypes ? (
              <LoadingSpinner size="small" text="Cargando categorías..." />
            ) : (
              tiposProducto &&
              tiposProducto.length > 0 &&
              tiposProducto
                .filter(
                  (tipo, index, self) =>
                    index === self.findIndex((t) => t.nombre === tipo.nombre)
                )
                .map((tipo) => (
                  <button
                    key={tipo.idTipoProducto}
                    className={`category-btn ${
                      selectedCategory === tipo.nombre ? "active" : ""
                    }`}
                    onClick={async () => {
                      setSelectedCategory(tipo.nombre);
                      setCurrentPage(1); // Resetear a la primera página al filtrar
                      console.log("Filtrar por tipo:", tipo.idTipoProducto);
                      try {
                        const productosFiltrados =
                          await ConexionApiBackend.obtenerProductosPorTipo(
                            tipo.idTipoProducto.toString()
                          );
                        setFilteredProducts(productosFiltrados);
                      } catch (error) {
                        console.error("Error filtrando productos:", error);
                        // Fallback: filtrar localmente
                        const productosFiltrados = products.filter(
                          (p) => p.tipoProductoId === tipo.idTipoProducto
                        );
                        setFilteredProducts(productosFiltrados);
                      }
                    }}
                  >
                    {tipo.nombre}
                  </button>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Location Banner */}
      {location && (
        <section className="location-banner">
          <div className="container">
            <div className="location-info">
              <div className="location-icon">📍</div>
              <div className="location-details">
                <h4>Ubicación Detectada</h4>
                <p>
                  Estamos entregando en tu área. Tiempo de entrega estimado: 2-3
                  días hábiles.
                </p>
                {location && (
                  <small>
                    Coordenadas: {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </small>
                )}
              </div>
              <div className="location-actions">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={async () => {
                    try {
                      await getCurrentLocation();
                      showSuccess("Éxito", "Dirección obtenida exitosamente");
                    } catch (error) {
                      console.error("Error obteniendo dirección:", error);
                    }
                  }}
                >
                  Ver Dirección
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Productos */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h3>{t("products.featuredProducts")}</h3>
            <div className="products-count">
              {filteredProducts.length} {t("products.productsFound")}
            </div>
          </div>

          <div className="products-grid">
            {isLoadingProducts ? (
              <LoadingSpinner
                size="large"
                text="Cargando productos..."
                className="products-grid"
              />
            ) : getCurrentPageProducts().length > 0 ? (
              getCurrentPageProducts().map((product) => (
                <div key={product.idProducto} className="product-card">
                  <div className="product-image-container">
                    <ProductImage
                      marca={product.marca}
                      imagenId={product.imagenId}
                      images={images}
                      className="product-image"
                      alt={product.marca}
                    />
                    <div className="product-overlay">
                      <button
                        className="overlay-btn"
                        onClick={() => handleViewReviews(product)}
                        title={t("additional.viewReviews")}
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`overlay-btn ${
                          favorites.includes(product.idProducto)
                            ? "favorited"
                            : ""
                        }`}
                        onClick={() => handleToggleFavorite(product.idProducto)}
                        title={t("additional.addToFavorites")}
                      >
                        <FaHeart />
                      </button>
                    </div>
                    {product.stock === 0 && (
                      <div className="out-of-stock-badge">Agotado</div>
                    )}
                    {product.precio > 150000 && (
                      <div className="premium-badge">Premium</div>
                    )}
                  </div>

                  <div className="product-info">
                    <h5 className="product-title">{product.marca}</h5>
                    <p className="product-color">{product.color}</p>
                    <div className="product-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="star" />
                      ))}
                      <span className="rating-text">(4.5)</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">
                        ${product.precio.toLocaleString()}
                      </span>
                      {product.precio > 100000 && (
                        <span className="original-price">
                          ${(product.precio * 1.2).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="product-stock">
                      {product.stock > 0 ? (
                        <span className="in-stock">
                          <FaCheck /> En stock ({product.stock})
                        </span>
                      ) : (
                        <span className="out-of-stock">✗ Agotado</span>
                      )}
                    </div>
                  </div>

                  <div className="product-actions">
                    {/* Solo mostrar botón de agregar al carrito para usuarios regulares */}
                    {currentUser?.role !== "admin" && (
                      <button
                        className="btn btn-primary btn-add-cart"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <FaShoppingCart /> Agregar al Carrito
                      </button>
                    )}

                    {/* Para administradores, mostrar botón de gestión */}
                    {currentUser?.role === "admin" && (
                      <button
                        className="btn btn-secondary btn-manage-product"
                        onClick={() => handleManageProduct(product)}
                      >
                        <FaEdit /> Gestionar
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <h4>No se encontraron productos</h4>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>

          {/* Componente de Paginación */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
              showItemsPerPage={true}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[12, 24, 48, 96]}
            />
          )}
        </div>
      </section>

      {/* Ofertas Especiales */}
      <section className="offers-section">
        <div className="container">
          <div className="offers-content">
            <div className="offer-card">
              <div className="offer-image">
                <img
                  src="/img2.png"
                  alt={t("additional.offerImage")}
                  className="offer-img"
                />
              </div>
              <div className="offer-info">
                <h3>Encuentra tu tenis perfecto</h3>
                <p>Buscador de Calzado</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    document
                      .querySelector(".products-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explorar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componentes fijos integrados */}
      <div className="fixed-components">
        <Chatbot
          products={products}
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        />
        <ShoppingCart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onOpen={() => setShowCart(true)}
          products={products}
          images={images}
          onShowCheckout={() => setShowCheckout(true)}
          onShowLogin={() => setShowLogin(true)}
        />
      </div>

      {/* Sistema de Notificaciones */}
      <NotificationSystem />

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => setShowLogin(false)}
        onShowRegister={() => setShowRegister(true)}
      />

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={() => setShowRegister(false)}
        onShowLogin={() => setShowLogin(true)}
      />

      {/* Panel de Administración */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        selectedProduct={selectedProductForManagement}
        onProductUpdated={() => {
          setSelectedProductForManagement(null);
          loadProducts(); // Recargar productos después de actualizar
        }}
      />

      {/* Dashboard Real */}
      <RealDashboard
        isOpen={showRealDashboard}
        onClose={() => setShowRealDashboard(false)}
        products={products}
      />

      {/* Modal de reseñas */}
      {selectedProductForReview && (
        <ProductReviews
          product={selectedProductForReview}
          isOpen={showReviews}
          onClose={() => {
            setShowReviews(false);
            setSelectedProductForReview(null);
          }}
          images={images}
        />
      )}

      {/* Dashboard de Usuario */}
      <UserDashboard
        isOpen={showUserDashboard}
        onClose={() => setShowUserDashboard(false)}
        user={currentUser}
      />

      {/* Advanced Search */}
      {showAdvancedSearch && (
        <AdvancedSearch
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          onSearchResults={handleSearchResults}
        />
      )}

      {/* Checkout Form */}
      {showCheckout && (
        <CheckoutForm
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={handleOrderComplete}
          onShowError={showError}
          onShowSuccess={showSuccess}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        currentStep={onboardingStep}
        onNext={handleOnboardingNext}
        onPrevious={handleOnboardingPrevious}
        onSkip={handleOnboardingClose}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
