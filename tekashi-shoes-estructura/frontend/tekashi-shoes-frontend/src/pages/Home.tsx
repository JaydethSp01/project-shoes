import {
  FaStar,
  FaHeart,
  FaEye,
  FaShoppingCart,
  FaHome,
  FaSearch,
  FaFilter,
  FaUser,
  FaShoppingBag,
  FaGift,
  FaPhone,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaUserShield,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
// import ProductForm from "../componets/ProductForm";
// import { useProductForm } from "../hooks/useProductForm";
import Chatbot from "../components/Chatbot";
import ShoppingCart from "../components/ShoppingCart";
import AdvancedSearch from "../components/AdvancedSearch";
import ProductReviews from "../components/ProductReviews";
import Footer from "../components/Footer";
// import NotificationSystem from "../components/NotificationSystem";
import AlertSystem from "../components/AlertSystem";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import AdminPanel from "../components/AdminPanel";
import RealDashboard from "../components/RealDashboard";
import ProductImage from "../components/ProductImage";
import { authService, User } from "../services/AuthService";
import { useState, useEffect } from "react";
import { Product, TipoProducto } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { cartService } from "../services/CartService";
import { notificationService } from "../services/NotificationService";

const Home = () => {
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

  // Datos temporales hasta implementar useProductForm
  const [products] = useState<Product[]>([]);
  const [images] = useState<{ [key: number]: string }>({});

  // Estados para funcionalidades
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState<Product | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showRealDashboard, setShowRealDashboard] = useState(false);

  // Cargar tipos de producto
  useEffect(() => {
    const loadTipos = async () => {
      try {
        const tipos = await ConexionApiBackend.obtenerTiposProducto();
        setTiposProducto(tipos);
      } catch (error) {
        console.error("Error cargando tipos de producto:", error);
      }
    };
    loadTipos();
  }, []);

  // Actualizar productos filtrados cuando cambien los productos
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Actualizar contadores del carrito (sin cache)
  useEffect(() => {
    const updateCartCounters = () => {
      setCartItemCount(cartService.getTotalItems());
      setCartTotal(cartService.getTotalPrice());
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

  // Suscribirse a cambios de autenticación
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Mostrar siempre como usuario invitado por defecto
  const isGuestMode = !currentUser;

  // Header con position: sticky - no necesita JavaScript

  const handleAddToCart = (product: Product) => {
    // El servicio del carrito maneja toda la lógica
    cartService.addItem(product, 1);

    // Mostrar notificación de éxito
    // notificationService.showNotification(
    //   "success",
    //   "Producto agregado",
    //   `${product.marca} ha sido agregado al carrito`
    // );
  };

  const handleToggleFavorite = (productId: number) => {
    const product = products.find((p) => p.idProducto === productId);
    if (!product) return;

    const isCurrentlyFavorite = favorites.includes(productId);

    setFavorites((prev) =>
      isCurrentlyFavorite
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // Notificar la acción
    notificationService.favoriteNotification(
      product.marca,
      !isCurrentlyFavorite
    );
  };

  const handleViewReviews = (product: Product) => {
    setSelectedProductForReview(product);
    setShowReviews(true);
  };

  // Función para obtener imagen por marca
  const getProductImageByBrand = (marca: string): string => {
    const brandImages: { [key: string]: string } = {
      Nike: "/shoe1.jpg",
      Adidas: "/shoe2.jpg",
      "Air Jordan": "/shoe1.jpg",
      Jordan: "/shoe1.jpg",
      Puma: "/shoe3.jpg",
      Converse: "/shoe4.jpg",
      Vans: "/shoe5.jpg",
      "New Balance": "/shoe1.jpg",
      Reebok: "/shoe2.jpg",
      Gucci: "/shoe3.jpg",
      Balenciaga: "/shoe4.jpg",
      Yeezy: "/shoe5.jpg",
      "Tommy Hilfiger": "/shoe1.jpg",
      Lacoste: "/shoe2.jpg",
      "Ralph Lauren": "/shoe3.jpg",
      "Calvin Klein": "/shoe4.jpg",
      Asics: "/shoe5.jpg",
      Brooks: "/shoe1.jpg",
      Saucony: "/shoe2.jpg",
      "Under Armour": "/shoe3.jpg",
    };

    // Buscar coincidencia parcial en la marca
    const brandKey = Object.keys(brandImages).find((key) =>
      marca.toLowerCase().includes(key.toLowerCase())
    );

    return brandKey ? brandImages[brandKey] : "/shoe1.jpg";
  };

  return (
    <div className="ecommerce-container">
      {/* Header Moderno */}
      <header className="modern-header">
        <div className="header-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="header-info">
                  <span>🚚 Envío gratis en compras superiores a $200.000</span>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <div className="header-links">
                  <a href="#ayuda">Ayuda</a>
                  <a href="#soporte">Soporte</a>
                  <a href="#contacto">Contacto</a>
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
                      <h1 className="brand-name">Tekashi Shoes</h1>
                      <p className="brand-tagline">Premium Footwear</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Búsqueda */}
              <div className="search-container">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar zapatos, marcas, colores..."
                    className="search-input"
                  />
                  <button
                    className="search-btn"
                    onClick={() => {
                      const searchInput = document.querySelector(
                        ".search-input"
                      ) as HTMLInputElement;
                      if (searchInput && searchInput.value.trim()) {
                        // Filtrar productos por texto de búsqueda
                        const searchTerm = searchInput.value.toLowerCase();
                        const filtered = products.filter(
                          (product) =>
                            product.marca.toLowerCase().includes(searchTerm) ||
                            product.color.toLowerCase().includes(searchTerm)
                        );
                        setFilteredProducts(filtered);
                      } else {
                        setFilteredProducts(products);
                      }
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Navegación */}
              <div className="navbar-nav">
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <FaHome /> Inicio
                </a>
                <a
                  href="#productos"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(".products-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FaShoppingBag /> Productos
                </a>
                <a
                  href="#ofertas"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(".offers-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FaGift /> Ofertas
                </a>
                <a
                  href="#contacto"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(".footer")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FaPhone /> Contacto
                </a>
              </div>

              {/* Usuario - Siempre mostrar opciones */}
              <div className="user-section">
                {currentUser ? (
                  <div className="user-info">
                    <span className="user-name">{currentUser.name}</span>
                    {authService.isAdmin() && (
                      <>
                        <button
                          className="admin-btn"
                          onClick={() => setShowAdminPanel(true)}
                          title="Panel de Administración"
                        >
                          <FaUserShield />
                        </button>
                        <button
                          className="dashboard-btn"
                          onClick={() => setShowRealDashboard(true)}
                          title="Dashboard Real"
                        >
                          <FaChartBar />
                        </button>
                      </>
                    )}
                    <button
                      className="logout-btn"
                      onClick={() => authService.logout()}
                      title="Cerrar Sesión"
                    >
                      <FaSignOutAlt />
                    </button>
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <button
                      className="guest-btn"
                      onClick={() => setShowRealDashboard(true)}
                      title="Vista de Administrador"
                    >
                      <FaChartBar />
                      Admin
                    </button>
                    <button
                      className="login-btn"
                      onClick={() => setShowLogin(true)}
                    >
                      <FaUser />
                      Iniciar Sesión
                    </button>
                    <button
                      className="register-btn"
                      onClick={() => setShowRegister(true)}
                    >
                      Registrarse
                    </button>
                  </div>
                )}
              </div>

              {/* Carrito */}
              <div className="cart-container">
                <button
                  className="cart-btn"
                  onClick={() => {
                    const cartElement = document.querySelector(
                      ".shopping-cart-container"
                    );
                    if (cartElement) {
                      cartElement.classList.add("active");
                    }
                  }}
                >
                  <FaShoppingCart />
                  <span className="cart-count">{cartItemCount}</span>
                  <span className="cart-total">
                    ${cartTotal.toLocaleString()}
                  </span>
                </button>
              </div>

              {/* Menú móvil */}
              <button
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Encuentra tu par perfecto</h1>
              <p className="hero-subtitle">
                Descubre nuestra colección premium de zapatos para cada ocasión
              </p>
              <div className="hero-buttons">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    document
                      .querySelector(".products-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ver Colección
                </button>
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => {
                    document
                      .querySelector(".offers-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ofertas Especiales
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img src="/img-1.png" alt="Hero" className="hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y Categorías */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-header">
            <h2>Nuestros Productos</h2>
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filtros
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {showFilters && (
            <div className="filters-content">
              <AdvancedSearch
                products={products}
                onFilteredProducts={setFilteredProducts}
                tiposProducto={tiposProducto}
              />
            </div>
          )}

          {/* Categorías */}
          <div className="categories-nav">
            <button
              className={`category-btn ${
                selectedCategory === null ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(null);
                console.log("Filtrar todos los productos");
              }}
            >
              Todos
            </button>
            {tiposProducto.map((tipo) => (
              <button
                key={tipo.idTipoProducto}
                className={`category-btn ${
                  selectedCategory === tipo.nombre ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(tipo.nombre);
                  console.log("Filtrar por tipo:", tipo.idTipoProducto);
                }}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h3>Productos Destacados</h3>
            <div className="products-count">
              {filteredProducts.length} productos encontrados
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                        title="Ver reseñas"
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
                        title="Agregar a favoritos"
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
                    <button
                      className="btn btn-primary btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <FaShoppingCart /> Agregar al Carrito
                    </button>
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
        </div>
      </section>

      {/* Ofertas Especiales */}
      <section className="offers-section">
        <div className="container">
          <div className="offers-content">
            <div className="offer-card">
              <div className="offer-image">
                <img src="/img2.png" alt="Oferta" className="offer-img" />
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

      {/* Componentes flotantes */}
      <Chatbot
        products={products}
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <ShoppingCart products={products} images={images} />

      {/* <NotificationSystem /> */}

      <AlertSystem />

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => setShowLogin(false)}
      />

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={() => setShowRegister(false)}
      />

      {/* Panel de Administración */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        products={products}
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
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
