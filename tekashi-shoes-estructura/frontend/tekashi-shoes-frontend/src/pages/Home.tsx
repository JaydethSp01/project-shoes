import {
  FaStar,
  FaHeart,
  FaEye,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaCheck,
} from "react-icons/fa";
// import ProductForm from "../componets/ProductForm";
// import { useProductForm } from "../hooks/useProductForm";
import Chatbot from "../components/Chatbot";
import ShoppingCart from "../components/ShoppingCart";
import AdvancedSearch from "../components/AdvancedSearch";
import ProductFilters from "../components/ProductFilters";
import CheckoutForm from "../components/CheckoutForm";
import ProductReviews from "../components/ProductReviews";
import Footer from "../components/Footer";
// import NotificationSystem from "../components/NotificationSystem";
// import AlertSystem from "../components/AlertSystem";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import AdminPanel from "../components/AdminPanel";
import RealDashboard from "../components/RealDashboard";
import UserDashboard from "../components/UserDashboard";
import UserMenu from "../components/UserMenu";
import ProductImage from "../components/ProductImage";
import Pagination from "../components/Pagination";
import { authService, User } from "../services/AuthService";
import { useState, useEffect } from "react";
import { Product, TipoProducto } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { cartService } from "../services/CartService";
import { notificationService } from "../services/NotificationService";
import "../styles/UserDashboard.css";
import "../styles/UserMenu.css";
import "../styles/AdminPanel.css";
import "../styles/AdvancedSearch.css";
import "../styles/ProductFilters.css";
import "../styles/CheckoutForm.css";
import "../styles/FavoritesManager.css";
import "../styles/WishlistManager.css";
import "../styles/Pagination.css";

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

  // Estados para productos e imágenes
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<{ [key: number]: string }>({});

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showRealDashboard, setShowRealDashboard] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Estados para búsqueda avanzada
  // const [searchResults, setSearchResults] = useState<Product[]>([]);
  // const [totalSearchResults, setTotalSearchResults] = useState(0);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productos = await ConexionApiBackend.obtenerProductos();
        console.log("Productos cargados:", productos);
        setProducts(productos);
      } catch (error) {
        console.error("Error cargando productos:", error);
        // Mostrar mensaje de error al usuario
        console.error(
          "Error de conexión: No se pudieron cargar los productos. Verifique que el servidor esté ejecutándose."
        );
      }
    };
    loadProducts();
  }, []);

  // Cargar imágenes de productos
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagenes = await ConexionApiBackend.obtenerImagenes();
        console.log("Imágenes cargadas:", imagenes);
        setImages(imagenes);
      } catch (error) {
        console.error("Error cargando imágenes:", error);
        // Continuar sin imágenes si hay error
        setImages({});
      }
    };
    loadImages();
  }, []);

  // Cargar tipos de producto
  useEffect(() => {
    const loadTipos = async () => {
      try {
        const tipos = await ConexionApiBackend.obtenerTiposProducto();
        console.log("Tipos de producto cargados:", tipos);
        setTiposProducto(tipos);
      } catch (error) {
        console.error("Error cargando tipos de producto:", error);
        // Continuar sin tipos si hay error
        setTiposProducto([]);
      }
    };
    loadTipos();
  }, []);

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

  // Suscribirse a cambios de autenticación
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Cargar favoritos del usuario cuando se loguee
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (currentUser) {
        try {
          const userFavorites =
            await ConexionApiBackend.obtenerFavoritosUsuario(currentUser.id);
          const favoriteIds = userFavorites.map((fav: any) => fav.productoId);
          setFavorites(favoriteIds);
        } catch (error) {
          console.error("Error cargando favoritos del usuario:", error);
        }
      } else {
        setFavorites([]);
      }
    };

    loadUserFavorites();
  }, [currentUser]);

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
    console.log("Pedido completado:", order);
    // Aquí podrías mostrar una notificación de éxito o redirigir a una página de confirmación
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
        await ConexionApiBackend.removerDeFavoritos(currentUser.id, productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        notificationService.favoriteNotification(product.marca, false);
      } else {
        // Agregar a favoritos
        await ConexionApiBackend.agregarAFavoritos(currentUser.id, productId);
        setFavorites((prev) => [...prev, productId]);
        notificationService.favoriteNotification(product.marca, true);
      }
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
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
                        setCurrentPage(1); // Resetear a la primera página
                      } else {
                        setFilteredProducts(products);
                        setCurrentPage(1); // Resetear a la primera página
                      }
                    }}
                  >
                    Buscar
                  </button>
                  <button
                    className="search-btn filters-btn"
                    onClick={() => setShowAdvancedSearch(true)}
                    title="Búsqueda Avanzada"
                  >
                    <FaFilter />
                  </button>
                </div>
              </div>

              {/* Nuevo Sistema de Menú */}
              <UserMenu
                user={currentUser}
                onLogout={() => authService.logout()}
                onShowDashboard={() => {
                  if (authService.isAdmin()) {
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
                console.log("Filtrar todos los productos");
              }}
            >
              Todos
            </button>
            {/* Eliminar duplicados de tipos de producto */}
            {tiposProducto
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
                          tipo.idTipoProducto
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
            {getCurrentPageProducts().length > 0 ? (
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

      <ShoppingCart
        products={products}
        images={images}
        onShowCheckout={() => setShowCheckout(true)}
      />

      {/* <NotificationSystem /> */}

      {/* <AlertSystem /> */}

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

      {/* Dashboard Real */}
      <RealDashboard
        isOpen={showRealDashboard}
        onClose={() => setShowRealDashboard(false)}
        products={products}
      />

      {/* Dashboard de Usuario */}
      <UserDashboard
        isOpen={showUserDashboard}
        onClose={() => setShowUserDashboard(false)}
        user={currentUser}
      />

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

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
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
