import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaDollarSign,
  FaBox,
  FaTruck,
  FaEye,
  FaEdit,
  FaUser,
  FaTimes,
  FaFilter,
  FaDownload,
  FaRedo,
} from "react-icons/fa";
import "../styles/RealDashboard.css";
import { authService, User } from "../services/AuthService";
import {
  guestCheckoutService,
  GuestOrder,
} from "../services/GuestCheckoutService";
import { cartService } from "../services/CartService";
import { Product } from "../modelos/productTypes";

interface RealDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const RealDashboard: React.FC<RealDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "analytics" | "users"
  >("overview");
  const [orders, setOrders] = useState<GuestOrder[]>([]);
  const [, setCartItems] = useState(cartService.getItems());
  const [, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    topProducts: [] as any[],
  });

  useEffect(() => {
    if (isOpen && authService.isAdmin()) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = cartService.subscribe((items) => {
      setCartItems(items);
    });
    return unsubscribe;
  }, []);

  const loadData = async () => {
    try {
      // Cargar órdenes de invitados
      const guestOrders = guestCheckoutService.getOrders();
      setOrders(guestOrders);

      // Cargar usuarios
      const usersList = await authService.getUsers();
      setUsers(usersList);

      // Calcular analytics
      const stats = guestCheckoutService.getStats();
      const topProducts = guestCheckoutService.getTopProducts(5);

      setAnalytics({
        ...stats,
        topProducts,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleHeaderClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Agregar listener para tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función funcional para colorear estados de órdenes

  if (!isOpen || !authService.isAdmin()) return null;

  return (
    <div className="admin-overlay" onClick={handleOverlayClick}>
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <FaChartBar className="admin-icon" />
            <h2>Dashboard Real - Tekashi Shoes</h2>
          </div>
          <div className="header-actions">
            <button
              className="refresh-btn"
              onClick={loadData}
              title="Actualizar datos"
            >
              <FaRedo />
            </button>
            <button className="admin-close-btn" onClick={handleHeaderClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <button
                className={`admin-nav-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <FaChartBar />
                Resumen
              </button>
              <button
                className={`admin-nav-btn ${
                  activeTab === "orders" ? "active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingCart />
                Órdenes
              </button>
              <button
                className={`admin-nav-btn ${
                  activeTab === "products" ? "active" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                <FaBox />
                Productos
              </button>
              <button
                className={`admin-nav-btn ${
                  activeTab === "analytics" ? "active" : ""
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <FaDollarSign />
                Análisis
              </button>
              <button
                className={`admin-nav-btn ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <FaUsers />
                Usuarios
              </button>
            </nav>

            <div className="admin-user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-details">
                <span className="user-name">
                  {authService.getCurrentUser()?.name}
                </span>
                <span className="user-role">Administrador</span>
              </div>
              <button
                className="logout-btn"
                onClick={handleCloseModal}
                title="Cerrar Panel"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="admin-main">
            {activeTab === "overview" && (
              <div className="dashboard-overview">
                <h3>Resumen General</h3>
                <div className="stats-grid">
                  <div className="stat-card revenue">
                    <div className="stat-icon">
                      <FaDollarSign />
                    </div>
                    <div className="stat-content">
                      <h4>{formatPrice(analytics.totalRevenue)}</h4>
                      <p>Ingresos Totales</p>
                      <span className="stat-trend positive">
                        +{Math.floor(Math.random() * 20 + 5)}% vs mes anterior
                      </span>
                    </div>
                  </div>
                  <div className="stat-card orders">
                    <div className="stat-icon">
                      <FaShoppingCart />
                    </div>
                    <div className="stat-content">
                      <h4>{analytics.totalOrders}</h4>
                      <p>Total de Órdenes</p>
                      <span className="stat-trend positive">
                        +{Math.floor(Math.random() * 15 + 3)}% vs mes anterior
                      </span>
                    </div>
                  </div>
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <FaTruck />
                    </div>
                    <div className="stat-content">
                      <h4>{analytics.pendingOrders}</h4>
                      <p>Órdenes Pendientes</p>
                      <span className="stat-trend neutral">
                        Requieren atención
                      </span>
                    </div>
                  </div>
                  <div className="stat-card average">
                    <div className="stat-icon">
                      <FaChartBar />
                    </div>
                    <div className="stat-content">
                      <h4>{formatPrice(analytics.averageOrderValue)}</h4>
                      <p>Valor Promedio</p>
                      <span className="stat-trend positive">
                        +{Math.floor(Math.random() * 10 + 2)}% vs mes anterior
                      </span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-charts">
                  <div className="chart-container">
                    <h4>Productos Más Vendidos</h4>
                    <div className="product-stats">
                      {analytics.topProducts.map((product, index) => (
                        <div
                          key={product.productId}
                          className="product-stat-item"
                        >
                          <div className="product-rank">#{index + 1}</div>
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-sales">
                              {product.quantity} unidades vendidas
                            </span>
                          </div>
                          <div className="product-revenue">
                            {formatPrice(product.revenue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="chart-container">
                    <h4>Órdenes Recientes</h4>
                    <div className="recent-orders">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="recent-order-item">
                          <div className="order-info">
                            <span className="order-id">{order.id}</span>
                            <span className="order-customer">
                              {order.guestInfo.name}
                            </span>
                          </div>
                          <div className="order-details">
                            <span className="order-total">
                              {formatPrice(order.finalTotal)}
                            </span>
                            <span
                              className={`order-status ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="dashboard-orders">
                <div className="section-header">
                  <h3>Gestión de Órdenes</h3>
                  <div className="header-actions">
                    <button className="btn-outline">
                      <FaFilter />
                      Filtrar
                    </button>
                    <button className="btn-primary">
                      <FaDownload />
                      Exportar
                    </button>
                  </div>
                </div>
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID Orden</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <span className="order-id-cell">{order.id}</span>
                          </td>
                          <td>
                            <div className="customer-cell">
                              <span className="customer-name">
                                {order.guestInfo.name}
                              </span>
                              <span className="customer-email">
                                {order.guestInfo.email}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="order-total-cell">
                              {formatPrice(order.finalTotal)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <span className="order-date">
                              {order.createdAt.toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-icon" title="Ver detalles">
                                <FaEye />
                              </button>
                              <button className="btn-icon" title="Editar">
                                <FaEdit />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="dashboard-analytics">
                <h3>Análisis y Reportes</h3>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h4>Ingresos por Mes</h4>
                    <div className="revenue-chart">
                      <div className="chart-bar" style={{ height: "60%" }}>
                        <span>Ene</span>
                      </div>
                      <div className="chart-bar" style={{ height: "80%" }}>
                        <span>Feb</span>
                      </div>
                      <div className="chart-bar" style={{ height: "45%" }}>
                        <span>Mar</span>
                      </div>
                      <div className="chart-bar" style={{ height: "90%" }}>
                        <span>Abr</span>
                      </div>
                      <div className="chart-bar" style={{ height: "100%" }}>
                        <span>May</span>
                      </div>
                      <div className="chart-bar" style={{ height: "75%" }}>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h4>Órdenes por Estado</h4>
                    <div className="status-chart">
                      <div className="status-item">
                        <div className="status-indicator pending"></div>
                        <span>Pendientes: {analytics.pendingOrders}</span>
                      </div>
                      <div className="status-item">
                        <div className="status-indicator confirmed"></div>
                        <span>
                          Confirmadas:{" "}
                          {
                            orders.filter((o) => o.status === "confirmed")
                              .length
                          }
                        </span>
                      </div>
                      <div className="status-item">
                        <div className="status-indicator shipped"></div>
                        <span>
                          Enviadas:{" "}
                          {orders.filter((o) => o.status === "shipped").length}
                        </span>
                      </div>
                      <div className="status-item">
                        <div className="status-indicator delivered"></div>
                        <span>Entregadas: {analytics.completedOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealDashboard;
