import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingBag,
  FaChartLine,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaDollarSign,
  FaShoppingCart,
  FaUserPlus,
  FaProductHunt,
  FaTags,
  FaImage,
  FaSave,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import "../styles/AdminPanelEnhanced.css";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsersToday: number;
  ordersToday: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  registrationDate: string;
  status: string;
  totalPurchases: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    tipoProductoId: "",
    marca: "",
    color: "",
    talla: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsData, usersData, statsData] = await Promise.all([
        ConexionApiBackend.obtenerProductos(),
        loadUsers(),
        loadAdminStats(),
      ]);

      setProducts(productsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError("Error cargando datos del panel de administración");
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (): Promise<AdminUser[]> => {
    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((user: any) => ({
          id: user.id.toString(),
          name: user.nombre,
          email: user.email,
          role: user.rol,
          registrationDate: user.fechaRegistro,
          status: user.estado === "activo" ? "active" : "inactive",
          totalPurchases: user.totalCompras || 0,
        }));
      } else {
        throw new Error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      // Fallback a usuarios simulados
      return [
        {
          id: "1",
          name: "Juan Pérez",
          email: "juan@email.com",
          role: "user",
          registrationDate: "2024-01-15",
          status: "active",
          totalPurchases: 5,
        },
        {
          id: "2",
          name: "María García",
          email: "maria@email.com",
          role: "user",
          registrationDate: "2024-01-14",
          status: "active",
          totalPurchases: 3,
        },
        {
          id: "3",
          name: "Carlos López",
          email: "carlos@email.com",
          role: "admin",
          registrationDate: "2024-01-10",
          status: "active",
          totalPurchases: 12,
        },
      ];
    }
  };

  const loadAdminStats = async (): Promise<AdminStats> => {
    try {
      const response = await fetch("http://localhost:8080/admin/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          newUsersToday: data.newUsersToday || 0,
          ordersToday: data.ordersToday || 0,
        };
      } else {
        throw new Error("Error al obtener estadísticas");
      }
    } catch (error) {
      console.error("Error loading admin stats:", error);
      // Fallback a estadísticas simuladas
      return {
        totalUsers: 1250,
        totalProducts: products.length,
        totalOrders: 3420,
        totalRevenue: 12500000,
        newUsersToday: 15,
        ordersToday: 28,
      };
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Actualizar producto existente
        await ConexionApiBackend.actualizarProducto(editingProduct.idProducto, {
          nombre: productForm.nombre,
          descripcion: productForm.descripcion,
          precio: Number(productForm.precio),
          stock: Number(productForm.stock),
          tipoProductoId: Number(productForm.tipoProductoId),
          marca: productForm.marca,
          color: productForm.color,
          talla: productForm.talla,
        });
      } else {
        // Crear nuevo producto
        await ConexionApiBackend.agregarProducto({
          idProducto: 0, // Se asignará en el backend
          nombre: productForm.nombre,
          descripcion: productForm.descripcion,
          precio: Number(productForm.precio),
          stock: Number(productForm.stock),
          tipoProductoId: Number(productForm.tipoProductoId),
          marca: productForm.marca,
          color: productForm.color,
          talla: productForm.talla,
          imagenId: 1, // Imagen por defecto
        });
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        tipoProductoId: "",
        marca: "",
        color: "",
        talla: "",
      });

      // Recargar productos
      const productsData = await ConexionApiBackend.obtenerProductos();
      setProducts(productsData);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio?.toString() || "",
      stock: product.stock?.toString() || "",
      tipoProductoId: product.tipoProductoId?.toString() || "",
      marca: product.marca || "",
      color: product.color || "",
      talla: product.talla || "",
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        // Llamada al backend para eliminar
        await ConexionApiBackend.eliminarProducto(productId);

        // Recargar productos
        const productsData = await ConexionApiBackend.obtenerProductos();
        setProducts(productsData);
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "products", label: "Productos", icon: FaProductHunt },
    { id: "users", label: "Usuarios", icon: FaUsers },
    { id: "orders", label: "Pedidos", icon: FaShoppingCart },
    { id: "settings", label: "Configuración", icon: FaCog },
  ];

  if (!isOpen) return null;

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Panel de Administración</h1>
            <p>Gestiona tu tienda de zapatos</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`nav-item ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="admin-main">
            {loading && (
              <div className="loading-spinner">
                <FaSpinner className="spinning" />
                <p>Cargando datos...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={loadAdminData} className="retry-btn">
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {activeTab === "dashboard" && stats && (
                  <div className="dashboard-section">
                    <h2>Resumen General</h2>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaUsers />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalUsers.toLocaleString()}</h3>
                          <p>Total Usuarios</p>
                          <span className="stat-change positive">
                            +{stats.newUsersToday} hoy
                          </span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaProductHunt />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalProducts}</h3>
                          <p>Productos</p>
                          <span className="stat-change">En catálogo</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaShoppingCart />
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalOrders.toLocaleString()}</h3>
                          <p>Pedidos</p>
                          <span className="stat-change positive">
                            +{stats.ordersToday} hoy
                          </span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">
                          <FaDollarSign />
                        </div>
                        <div className="stat-content">
                          <h3>${stats.totalRevenue.toLocaleString()}</h3>
                          <p>Ingresos</p>
                          <span className="stat-change positive">
                            +12% vs mes anterior
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="quick-actions">
                      <h3>Acciones Rápidas</h3>
                      <div className="actions-grid">
                        <button
                          className="action-card"
                          onClick={() => setActiveTab("products")}
                        >
                          <FaPlus />
                          <span>Agregar Producto</span>
                        </button>
                        <button
                          className="action-card"
                          onClick={() => setActiveTab("users")}
                        >
                          <FaUserPlus />
                          <span>Ver Usuarios</span>
                        </button>
                        <button className="action-card">
                          <FaDownload />
                          <span>Exportar Reportes</span>
                        </button>
                        <button className="action-card">
                          <FaUpload />
                          <span>Importar Productos</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "products" && (
                  <div className="products-section">
                    <div className="section-header">
                      <h2>Gestión de Productos</h2>
                      <div className="header-actions">
                        <div className="search-box">
                          <FaSearch />
                          <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => setShowProductForm(true)}
                        >
                          <FaPlus />
                          Nuevo Producto
                        </button>
                      </div>
                    </div>

                    <div className="products-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id}>
                              <td>
                                <div className="product-image">
                                  <FaImage />
                                </div>
                              </td>
                              <td>
                                <div className="product-info">
                                  <strong>{product.nombre}</strong>
                                  <small>{product.descripcion}</small>
                                </div>
                              </td>
                              <td>{product.marca}</td>
                              <td>${product.precio?.toLocaleString()}</td>
                              <td>
                                <span
                                  className={`stock-badge ${
                                    product.stock && product.stock > 0
                                      ? "in-stock"
                                      : "out-of-stock"
                                  }`}
                                >
                                  {product.stock || 0}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    product.stock && product.stock > 0
                                      ? "active"
                                      : "inactive"
                                  }`}
                                >
                                  {product.stock && product.stock > 0
                                    ? "Activo"
                                    : "Inactivo"}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="btn-icon"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
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

                {activeTab === "users" && (
                  <div className="users-section">
                    <div className="section-header">
                      <h2>Gestión de Usuarios</h2>
                      <div className="search-box">
                        <FaSearch />
                        <input
                          type="text"
                          placeholder="Buscar usuarios..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="users-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Registro</th>
                            <th>Compras</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="user-info">
                                  <div className="user-avatar">
                                    <FaUsers />
                                  </div>
                                  <span>{user.name}</span>
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`role-badge ${user.role}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>{user.registrationDate}</td>
                              <td>{user.totalPurchases}</td>
                              <td>
                                <span className={`status-badge ${user.status}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button className="btn-icon">
                                    <FaEye />
                                  </button>
                                  <button className="btn-icon">
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

                {activeTab === "orders" && (
                  <div className="orders-section">
                    <div className="section-header">
                      <h2>Gestión de Pedidos</h2>
                      <div className="search-box">
                        <FaSearch />
                        <input
                          type="text"
                          placeholder="Buscar pedidos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="orders-table">
                      <table>
                        <thead>
                          <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>#TK001</td>
                            <td>Juan Pérez</td>
                            <td>2024-01-15</td>
                            <td>$350,000</td>
                            <td>
                              <span className="status-badge shipped">
                                Enviado
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-icon">
                                  <FaEye />
                                </button>
                                <button className="btn-icon">
                                  <FaEdit />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>#TK002</td>
                            <td>María García</td>
                            <td>2024-01-14</td>
                            <td>$280,000</td>
                            <td>
                              <span className="status-badge pending">
                                Pendiente
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-icon">
                                  <FaEye />
                                </button>
                                <button className="btn-icon">
                                  <FaEdit />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="settings-section">
                    <h2>Configuración del Sistema</h2>
                    <div className="settings-grid">
                      <div className="setting-card">
                        <h3>Gestión de Base de Datos</h3>
                        <p>Realizar respaldos y mantenimiento de la BD</p>
                        <div className="setting-actions">
                          <button className="btn-secondary">
                            Respaldar BD
                          </button>
                          <button className="btn-secondary">
                            Optimizar BD
                          </button>
                          <button className="btn-secondary">
                            Ver Estadísticas
                          </button>
                        </div>
                      </div>
                      <div className="setting-card">
                        <h3>Gestión de Usuarios</h3>
                        <p>Administrar usuarios y permisos del sistema</p>
                        <div className="setting-actions">
                          <button className="btn-secondary">
                            Crear Usuario
                          </button>
                          <button className="btn-secondary">
                            Gestionar Roles
                          </button>
                          <button className="btn-secondary">Ver Logs</button>
                        </div>
                      </div>
                      <div className="setting-card">
                        <h3>Gestión de Productos</h3>
                        <p>Administrar catálogo y tipos de productos</p>
                        <div className="setting-actions">
                          <button className="btn-secondary">
                            Importar Productos
                          </button>
                          <button className="btn-secondary">
                            Exportar Catálogo
                          </button>
                          <button className="btn-secondary">
                            Gestionar Tipos
                          </button>
                        </div>
                      </div>
                      <div className="setting-card">
                        <h3>Configuración de Sistema</h3>
                        <p>Configurar parámetros generales del sistema</p>
                        <div className="setting-actions">
                          <button className="btn-secondary">
                            Configurar Email
                          </button>
                          <button className="btn-secondary">
                            Configurar Pagos
                          </button>
                          <button className="btn-secondary">
                            Configurar Envíos
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="system-info">
                      <h3>Información del Sistema</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Versión del Sistema:</label>
                          <span>1.0.0</span>
                        </div>
                        <div className="info-item">
                          <label>Último Respaldo:</label>
                          <span>2024-01-15 14:30:00</span>
                        </div>
                        <div className="info-item">
                          <label>Usuarios Activos:</label>
                          <span>{stats?.totalUsers || 0}</span>
                        </div>
                        <div className="info-item">
                          <label>Productos en Catálogo:</label>
                          <span>{stats?.totalProducts || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal de Formulario de Producto */}
        {showProductForm && (
          <div className="modal-overlay">
            <div className="product-form-modal">
              <div className="modal-header">
                <h3>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input
                      type="text"
                      value={productForm.nombre}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Ej: Nike Air Max 270"
                    />
                  </div>
                  <div className="form-group">
                    <label>Marca</label>
                    <input
                      type="text"
                      value={productForm.marca}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          marca: e.target.value,
                        })
                      }
                      placeholder="Ej: Nike"
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={productForm.precio}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          precio: e.target.value,
                        })
                      }
                      placeholder="Ej: 250000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      placeholder="Ej: 50"
                    />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      value={productForm.color}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          color: e.target.value,
                        })
                      }
                      placeholder="Ej: Negro"
                    />
                  </div>
                  <div className="form-group">
                    <label>Talla</label>
                    <input
                      type="text"
                      value={productForm.talla}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          talla: e.target.value,
                        })
                      }
                      placeholder="Ej: 42"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Descripción</label>
                    <textarea
                      value={productForm.descripcion}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Descripción detallada del producto..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                >
                  <FaTimes />
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleSaveProduct}>
                  <FaSave />
                  {editingProduct ? "Actualizar" : "Crear"} Producto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;