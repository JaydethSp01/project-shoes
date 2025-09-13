import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";
import { authService, User } from "../services/AuthService";
import { cartService } from "../services/CartService";
import { Product } from "../modelos/productTypes";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "products" | "orders"
  >("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [cartItems, setCartItems] = useState(cartService.getItems());

  useEffect(() => {
    if (isOpen && authService.isAdmin()) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = cartService.subscribe((items) => {
      setCartItems(items);
    });
    return unsubscribe;
  }, []);

  const loadUsers = async () => {
    try {
      const usersList = await authService.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    onClose();
  };

  if (!isOpen || !authService.isAdmin()) return null;

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: cartItems.length,
    totalRevenue: cartItems.reduce(
      (sum, item) => sum + item.product.precio * item.quantity,
      0
    ),
  };

  return (
    <div className="admin-overlay">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <FaUserShield className="admin-icon" />
            <h2>Panel de Administración</h2>
          </div>
          <button className="admin-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <button
                className={`admin-nav-btn ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <FaChartBar />
                Dashboard
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
              <button
                className={`admin-nav-btn ${
                  activeTab === "products" ? "active" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                <FaShoppingCart />
                Productos
              </button>
              <button
                className={`admin-nav-btn ${
                  activeTab === "orders" ? "active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingCart />
                Pedidos
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
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          </div>

          <div className="admin-main">
            {activeTab === "dashboard" && (
              <div className="admin-dashboard">
                <h3>Dashboard</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                    <div className="stat-content">
                      <h4>{stats.totalUsers}</h4>
                      <p>Usuarios Registrados</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaShoppingCart />
                    </div>
                    <div className="stat-content">
                      <h4>{stats.totalProducts}</h4>
                      <p>Productos Disponibles</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaChartBar />
                    </div>
                    <div className="stat-content">
                      <h4>{stats.totalOrders}</h4>
                      <p>Pedidos Activos</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaChartBar />
                    </div>
                    <div className="stat-content">
                      <h4>${stats.totalRevenue.toLocaleString()}</h4>
                      <p>Ingresos Totales</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="admin-users">
                <div className="section-header">
                  <h3>Gestión de Usuarios</h3>
                  <button className="btn-primary">
                    <FaPlus />
                    Nuevo Usuario
                  </button>
                </div>
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-small">
                                <FaUser />
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === "admin"
                                ? "Administrador"
                                : "Usuario"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-icon" title="Ver">
                                <FaEye />
                              </button>
                              <button className="btn-icon" title="Editar">
                                <FaEdit />
                              </button>
                              <button
                                className="btn-icon danger"
                                title="Eliminar"
                              >
                                <FaTrash />
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

            {activeTab === "products" && (
              <div className="admin-products">
                <div className="section-header">
                  <h3>Gestión de Productos</h3>
                  <button className="btn-primary">
                    <FaPlus />
                    Nuevo Producto
                  </button>
                </div>
                <div className="products-grid">
                  {products.slice(0, 6).map((product) => (
                    <div
                      key={product.idProducto}
                      className="product-card-admin"
                    >
                      <div className="product-image">
                        <img
                          src={`/shoe${(product.idProducto % 5) + 1}.jpg`}
                          alt={product.marca}
                        />
                      </div>
                      <div className="product-info">
                        <h4>{product.marca}</h4>
                        <p>{product.color}</p>
                        <span className="price">
                          ${product.precio.toLocaleString()}
                        </span>
                      </div>
                      <div className="product-actions">
                        <button className="btn-icon" title="Editar">
                          <FaEdit />
                        </button>
                        <button className="btn-icon danger" title="Eliminar">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="admin-orders">
                <div className="section-header">
                  <h3>Gestión de Pedidos</h3>
                </div>
                <div className="orders-list">
                  {cartItems.map((item, index) => (
                    <div key={index} className="order-card">
                      <div className="order-info">
                        <h4>{item.product.marca}</h4>
                        <p>Cantidad: {item.quantity}</p>
                        <p>
                          Precio: $
                          {(
                            item.product.precio * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className="status-badge pending">Pendiente</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
