import React, { useState, useEffect } from "react";
import { unifiedAuthService } from "../services/UnifiedAuthService";

// Helper function to get base URL
const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

// Helper function to get headers with authentication
const getAuthHeaders = async () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const token = await unifiedAuthService.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error obteniendo token de autenticación:", error);
  }

  return headers;
};
import {
  FaUsers,
  FaChartLine,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaDownload,
  FaUpload,
  FaSpinner,
  FaTimes,
  FaDollarSign,
  FaShoppingCart,
  FaUserPlus,
  FaProductHunt,
  FaImage,
  FaSave,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import ProductManagementModal from "./ProductManagementModal";
import BeautifulAlert from "./BeautifulAlert";
import AdminHeader from "./AdminHeader";
import { useBeautifulAlert } from "../hooks/useBeautifulAlert";
import { useTranslation } from "../hooks/useTranslation";
import { validateEndpoints } from "../utils/endpointValidator";
import "../styles/AdminPanelEnhanced.css";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
  onProductUpdated?: () => void;
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

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  onProductUpdated,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductManagement, setShowProductManagement] = useState(false);
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

  // Hook para alertas bonitas
  const { alertState, showSuccess, showError, showConfirm, hideAlert } =
    useBeautifulAlert();

  // Hook para traducciones
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Abrir modal de gestión cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      setEditingProduct(selectedProduct);
      setShowProductManagement(true);
      setActiveTab("products"); // Cambiar a la pestaña de productos
    }
  }, [selectedProduct]);

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
      const headers = await getAuthHeaders();
      console.log("🔍 Cargando usuarios con headers:", headers);

      const response = await fetch(`${getBaseUrl()}/api/usuarios`, {
        method: "GET",
        headers,
      });

      console.log(
        "📡 Respuesta de usuarios:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Usuarios cargados:", data);
        return data.map(
          (user: {
            id: number;
            nombre: string;
            email: string;
            rol: string;
            fechaRegistro: string;
            estado: string;
            totalCompras?: number;
          }) => ({
            id: user.id.toString(),
            name: user.nombre,
            email: user.email,
            role: user.rol,
            registrationDate: user.fechaRegistro,
            status: user.estado === "activo" ? "active" : "inactive",
            totalPurchases: user.totalCompras || 0,
          })
        );
      } else {
        const errorText = await response.text();
        console.error(
          "❌ Error en respuesta de usuarios:",
          response.status,
          errorText
        );
        throw new Error(
          `Error al obtener usuarios: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("❌ Error loading users:", error);
      throw error;
    }
  };

  const loadAdminStats = async (): Promise<AdminStats> => {
    try {
      const headers = await getAuthHeaders();
      console.log("🔍 Cargando estadísticas con headers:", headers);

      const response = await fetch(`${getBaseUrl()}/api/admin/dashboard`, {
        method: "GET",
        headers,
      });

      console.log(
        "📡 Respuesta de estadísticas:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Estadísticas cargadas:", data);
        // El backend devuelve los datos en data.data
        const stats = data.data || data;
        return {
          totalUsers: stats.total_usuarios || 0,
          totalProducts: stats.total_productos || 0,
          totalOrders: stats.total_pedidos || 0,
          totalRevenue: stats.valor_inventario || 0,
          newUsersToday: stats.registros || 0,
          ordersToday: stats.compras || 0,
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
        await ConexionApiBackend.actualizarProducto(
          editingProduct.idProducto.toString(),
          {
            nombre: productForm.nombre,
            descripcion: productForm.descripcion,
            precio: Number(productForm.precio),
            stock: Number(productForm.stock),
            tipoProductoId: Number(productForm.tipoProductoId),
            marca: productForm.marca,
            color: productForm.color,
            talla: productForm.talla,
          }
        );
      } else {
        // Crear nuevo producto
        await ConexionApiBackend.agregarProducto({
          idProducto: 0, // Se asignará en el backend
          tipoProductoId: Number(productForm.tipoProductoId),
          marca: productForm.marca,
          color: productForm.color,
          precio: Number(productForm.precio),
          stock: Number(productForm.stock),
          imagenId: 1, // Imagen por defecto
        });
      }

      setShowProductManagement(false);
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

  // Funciones para gestión de base de datos
  const handleBackupDatabase = async () => {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/backup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showSuccess(
          "✅ Respaldo Creado",
          "Respaldo de base de datos creado exitosamente"
        );
      } else {
        showError("❌ Error", "Error al crear el respaldo de la base de datos");
      }
    } catch (error) {
      console.error("Error creating database backup:", error);
      showError("❌ Error", "Error al crear el respaldo de la base de datos");
    }
  };

  const handleOptimizeDatabase = async () => {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showSuccess(
          "✅ Base de Datos Optimizada",
          "Base de datos optimizada exitosamente"
        );
      } else {
        showError("❌ Error", "Error al optimizar la base de datos");
      }
    } catch (error) {
      console.error("Error optimizing database:", error);
      showError("❌ Error", "Error al optimizar la base de datos");
    }
  };

  const handleViewDatabaseStats = async () => {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const stats = await response.json();
        showSuccess(
          "📊 Estadísticas de la Base de Datos",
          `Tablas: ${stats.tables || "N/A"}\nRegistros totales: ${
            stats.totalRecords || "N/A"
          }\nTamaño: ${stats.size || "N/A"}\nÚltima optimización: ${
            stats.lastOptimization || "N/A"
          }`
        );
      } else {
        showError(
          "❌ Error",
          "Error al obtener las estadísticas de la base de datos"
        );
      }
    } catch (error) {
      console.error("Error getting database stats:", error);
      showError(
        "❌ Error",
        "Error al obtener las estadísticas de la base de datos"
      );
    }
  };

  // Funciones para gestión de usuarios
  const handleCreateUser = async () => {
    const nombre = prompt("Nombre del usuario:");
    const email = prompt("Email del usuario:");
    const password = prompt("Contraseña del usuario:");
    const role = prompt("Rol del usuario (ADMIN/CLIENTE):");

    if (!nombre || !email || !password || !role) {
      showError("❌ Campos Obligatorios", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            email,
            password,
            role: role.toUpperCase(),
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        showSuccess("✅ Usuario Creado", result.message);
        loadUsers();
      } else {
        showError("❌ Error", result.message);
      }
    } catch (error) {
      showError("❌ Error", `Error al crear usuario: ${error}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    showConfirm(
      "⚠️ Eliminar Usuario",
      "¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer y eliminará todos los datos relacionados.",
      async () => {
        try {
          const response = await fetch(
            "https://backend-ecommerce-6vi3.onrender.com/api/admin/delete-user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
              }),
            }
          );

          const result = await response.json();
          if (result.success) {
            showSuccess("✅ Usuario Eliminado", result.message);
            loadUsers();
          } else {
            showError("❌ Error", result.message);
          }
        } catch (error) {
          showError("❌ Error", `Error al eliminar usuario: ${error}`);
        }
      },
      "Eliminar",
      "Cancelar"
    );
  };

  const handleManageRoles = async () => {
    const userId = prompt("ID del usuario:");
    const newRole = prompt("Nuevo rol (ADMIN/CLIENTE):");

    if (!userId || !newRole) {
      showError("❌ Campos Obligatorios", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/update-role",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            newRole: newRole.toUpperCase(),
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        showSuccess("✅ Rol Actualizado", result.message);
        loadUsers();
      } else {
        showError("❌ Error", result.message);
      }
    } catch (error) {
      showError("❌ Error", `Error al actualizar rol: ${error}`);
    }
  };

  const handleViewLogs = async () => {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/logs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const logs = await response.json();
        const logInfo = logs
          .slice(0, 10)
          .map(
            (log: { timestamp: string; message: string }) =>
              `${log.timestamp}: ${log.message}`
          )
          .join("\n");
        showSuccess("📋 Logs del Sistema", logInfo);
      } else {
        showSuccess(
          "📋 Logs del Sistema",
          "Funcionalidad de ver logs - En desarrollo"
        );
      }
    } catch (error) {
      console.error("Error accessing logs:", error);
      showError("❌ Error", "Funcionalidad de ver logs - En desarrollo");
    }
  };

  // Nueva función para validar endpoints
  const handleValidateEndpoints = async () => {
    try {
      showSuccess(
        "🔍 Validando Endpoints",
        "Iniciando validación de todos los endpoints..."
      );

      const results = await validateEndpoints();
      const successRate =
        (results.filter((r) => r.status === "success").length /
          results.length) *
        100;

      const summary = results
        .map((result) => {
          const statusIcon =
            result.status === "success"
              ? "✅"
              : result.status === "unauthorized"
              ? "🔒"
              : result.status === "forbidden"
              ? "🚫"
              : "❌";
          return `${statusIcon} ${result.method} ${result.endpoint} - ${result.statusCode}`;
        })
        .join("\n");

      showSuccess(
        `📊 Validación Completada (${successRate.toFixed(1)}% éxito)`,
        `Resultados:\n\n${summary}`
      );
    } catch (error) {
      console.error("Error validating endpoints:", error);
      showError("❌ Error", "Error al validar endpoints");
    }
  };

  // Funciones para gestión de productos
  const handleImportProducts = () => {
    // Crear input para archivo
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          try {
            const response = await fetch(
              "https://backend-ecommerce-6vi3.onrender.com/api/admin/import-products",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: content,
              }
            );

            const result = await response.json();
            if (result.success) {
              showSuccess("✅ Productos Importados", result.message);
              loadProducts();
            } else {
              showError("❌ Error", result.message);
            }
          } catch (error) {
            console.error("Error importing products:", error);
            showError("❌ Error", `Error al importar productos: ${error}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportCatalog = async () => {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/admin/export-catalog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        showSuccess(
          "✅ Catálogo Exportado",
          `${result.message}\nArchivo: ${result.file}`
        );

        // Crear enlace de descarga
        const link = document.createElement("a");
        link.href = result.download_url || "#";
        link.download = result.file;
        link.textContent = "Descargar archivo";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showError("❌ Error", result.message);
      }
    } catch (error) {
      showError("❌ Error", `Error al exportar catálogo: ${error}`);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    showConfirm(
      "🗑️ Eliminar Producto",
      "¿Estás seguro de que quieres eliminar este producto del catálogo? Esta acción no se puede deshacer.",
      async () => {
        try {
          const response = await fetch(
            "https://backend-ecommerce-6vi3.onrender.com/api/admin/delete-product",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productId: productId,
              }),
            }
          );

          const result = await response.json();
          if (result.success) {
            showSuccess("✅ Producto Eliminado", result.message);
            loadProducts();
          } else {
            showError("❌ Error", result.message);
          }
        } catch (error) {
          showError("❌ Error", `Error al eliminar producto: ${error}`);
        }
      },
      "Eliminar",
      "Cancelar"
    );
  };

  const handleManageTypes = async () => {
    try {
      // Obtener tipos existentes
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/tipo_producto",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const tipos = await response.json();
        const tiposInfo = tipos
          .map(
            (tipo: { nombre: string; idTipoProducto: number }) =>
              `- ${tipo.nombre} (ID: ${tipo.idTipoProducto})`
          )
          .join("\n");

        const action = prompt(
          `Tipos de productos actuales:\n\n${tiposInfo}\n\n¿Qué deseas hacer?\n1. Crear nuevo tipo\n2. Ver detalles`,
          "1"
        );

        if (action === "1") {
          const nombreTipo = prompt(
            "Ingresa el nombre del nuevo tipo de producto:"
          );
          if (nombreTipo) {
            const createResponse = await fetch(
              "https://backend-ecommerce-6vi3.onrender.com/api/tipo_producto",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nombreTipo }),
              }
            );

            if (createResponse.ok) {
              showSuccess(
                "✅ Tipo Creado",
                "Tipo de producto creado exitosamente"
              );
              // Recargar tipos de producto
              const updatedTipos =
                await ConexionApiBackend.obtenerTiposProducto();
              console.log("Tipos actualizados:", updatedTipos);
            } else {
              showError("❌ Error", "Error al crear el tipo de producto");
            }
          }
        }
      } else {
        showError("❌ Error", "Error al obtener los tipos de producto");
      }
    } catch (error) {
      console.error("Error managing types:", error);
      showError("❌ Error", "Error al gestionar tipos de producto");
    }
  };

  // Funciones para configuración del sistema
  const handleConfigureEmail = async () => {
    try {
      const smtpHost = prompt("SMTP Host:", "smtp.gmail.com");
      const smtpPort = prompt("SMTP Puerto:", "587");
      const email = prompt("Email del sistema:", "admin@tekaishoes.com");
      const password = prompt("Contraseña del email:", "");

      if (smtpHost && smtpPort && email) {
        const response = await fetch(
          "https://backend-ecommerce-6vi3.onrender.com/api/admin/config/email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              smtpHost,
              smtpPort: parseInt(smtpPort),
              email,
              password,
            }),
          }
        );

        if (response.ok) {
          showSuccess(
            "✅ Configuración Guardada",
            "Configuración de email guardada exitosamente"
          );
        } else {
          showError("❌ Error", "Error al guardar la configuración de email");
        }
      }
    } catch (error) {
      console.error("Error configuring email:", error);
      showError("❌ Error", "Error al configurar el email");
    }
  };

  const handleConfigurePayments = async () => {
    try {
      const paymentMethods = prompt(
        "Métodos de pago habilitados (separados por coma):",
        "Tarjeta de Crédito,PayPal,Transferencia Bancaria"
      );
      const currency = prompt("Moneda principal:", "COP");
      const taxRate = prompt("Tasa de impuestos (%):", "19");

      if (paymentMethods && currency && taxRate) {
        const response = await fetch(
          "https://backend-ecommerce-6vi3.onrender.com/api/admin/config/payments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentMethods: paymentMethods.split(",").map((m) => m.trim()),
              currency,
              taxRate: parseFloat(taxRate),
            }),
          }
        );

        if (response.ok) {
          showSuccess(
            "✅ Configuración Guardada",
            "Configuración de pagos guardada exitosamente"
          );
        } else {
          showError("❌ Error", "Error al guardar la configuración de pagos");
        }
      }
    } catch (error) {
      console.error("Error configuring payments:", error);
      showError("❌ Error", "Error al configurar los pagos");
    }
  };

  const handleConfigureShipping = async () => {
    try {
      const freeShippingThreshold = prompt(
        "Umbral para envío gratis (en pesos):",
        "200000"
      );
      const standardShippingCost = prompt("Costo de envío estándar:", "15000");
      const expressShippingCost = prompt("Costo de envío express:", "25000");

      if (
        freeShippingThreshold &&
        standardShippingCost &&
        expressShippingCost
      ) {
        const response = await fetch(
          "https://backend-ecommerce-6vi3.onrender.com/api/admin/config/shipping",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              freeShippingThreshold: parseFloat(freeShippingThreshold),
              standardShippingCost: parseFloat(standardShippingCost),
              expressShippingCost: parseFloat(expressShippingCost),
            }),
          }
        );

        if (response.ok) {
          showSuccess(
            "✅ Configuración Guardada",
            "Configuración de envíos guardada exitosamente"
          );
        } else {
          showError("❌ Error", "Error al guardar la configuración de envíos");
        }
      }
    } catch (error) {
      console.error("Error configuring shipping:", error);
      showError("❌ Error", "Error al configurar los envíos");
    }
  };

  // Funciones para gestión de productos
  const handleManageProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductManagement(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductManagement(true);
  };

  const loadProducts = async () => {
    try {
      const productsData = await ConexionApiBackend.obtenerProductos();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleProductSaved = async () => {
    // Recargar la lista de productos
    await loadProducts();
    setShowProductManagement(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    {
      id: "dashboard",
      label: t("adminPanel.dashboard.overview"),
      icon: FaChartLine,
    },
    {
      id: "products",
      label: t("adminPanel.productManagement.management"),
      icon: FaProductHunt,
    },
    { id: "users", label: t("adminPanel.users.management"), icon: FaUsers },
    {
      id: "orders",
      label: t("adminPanel.orders.management"),
      icon: FaShoppingCart,
    },
    {
      id: "settings",
      label: t("adminPanel.settings.systemConfig"),
      icon: FaCog,
    },
  ];

  // Función para manejar click en overlay
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

  // Funciones funcionales para el panel de administración

  if (!isOpen) return null;

  return (
    <>
      <div className="admin-panel-overlay" onClick={handleOverlayClick}>
        <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
          <AdminHeader onClose={onClose} />

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
                  <p>{t("common.loading")}</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={loadAdminData} className="retry-btn">
                    {t("common.retry")}
                  </button>
                </div>
              )}

              {!loading && !error && (
                <>
                  {activeTab === "dashboard" && stats && (
                    <div className="dashboard-section">
                      <h2>{t("adminPanel.dashboard.overview")}</h2>
                      <div className="stats-grid">
                        <div className="stat-card">
                          <div className="stat-icon">
                            <FaUsers />
                          </div>
                          <div className="stat-content">
                            <h3>{stats.totalUsers.toLocaleString()}</h3>
                            <p>{t("adminPanel.dashboard.totalUsers")}</p>
                            <span className="stat-change positive">
                              +{stats.newUsersToday}{" "}
                              {t("adminPanel.dashboard.today")}
                            </span>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <FaProductHunt />
                          </div>
                          <div className="stat-content">
                            <h3>{stats.totalProducts}</h3>
                            <p>{t("adminPanel.dashboard.products")}</p>
                            <span className="stat-change">
                              {t("adminPanel.dashboard.inCatalog")}
                            </span>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <FaShoppingCart />
                          </div>
                          <div className="stat-content">
                            <h3>{stats.totalOrders.toLocaleString()}</h3>
                            <p>{t("adminPanel.dashboard.orders")}</p>
                            <span className="stat-change positive">
                              +{stats.ordersToday}{" "}
                              {t("adminPanel.dashboard.today")}
                            </span>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <FaDollarSign />
                          </div>
                          <div className="stat-content">
                            <h3>${stats.totalRevenue.toLocaleString()}</h3>
                            <p>{t("adminPanel.dashboard.revenue")}</p>
                            <span className="stat-change positive">
                              +12% {t("adminPanel.dashboard.vsLastMonth")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="quick-actions">
                        <h3>{t("adminPanel.dashboard.quickActions")}</h3>
                        <div className="actions-grid">
                          <button
                            className="action-card"
                            onClick={handleCreateProduct}
                          >
                            <FaPlus />
                            <span>{t("adminPanel.dashboard.addProduct")}</span>
                          </button>
                          <button
                            className="action-card"
                            onClick={() => setActiveTab("users")}
                          >
                            <FaUserPlus />
                            <span>{t("adminPanel.dashboard.viewUsers")}</span>
                          </button>
                          <button
                            className="action-card"
                            onClick={handleExportCatalog}
                          >
                            <FaDownload />
                            <span>
                              {t("adminPanel.dashboard.exportReports")}
                            </span>
                          </button>
                          <button
                            className="action-card"
                            onClick={handleImportProducts}
                          >
                            <FaUpload />
                            <span>
                              {t("adminPanel.dashboard.importProducts")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "products" && (
                    <div className="products-section">
                      <div className="section-header">
                        <h2>{t("adminPanel.products.management")}</h2>
                        <div className="header-actions">
                          <div className="search-box">
                            <FaSearch />
                            <input
                              type="text"
                              placeholder={t(
                                "admin.products.searchPlaceholder"
                              )}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <button
                            className="btn-primary"
                            onClick={() => setShowProductManagement(true)}
                          >
                            <FaPlus />
                            {t("adminPanel.products.newProduct")}
                          </button>
                        </div>
                      </div>

                      <div className="products-table">
                        <table>
                          <thead>
                            <tr>
                              <th>{t("adminPanel.products.image")}</th>
                              <th>{t("adminPanel.products.name")}</th>
                              <th>{t("adminPanel.products.brand")}</th>
                              <th>{t("adminPanel.products.price")}</th>
                              <th>{t("adminPanel.products.stock")}</th>
                              <th>{t("adminPanel.products.status")}</th>
                              <th>{t("adminPanel.products.actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((product) => (
                              <tr key={product.idProducto}>
                                <td>
                                  <div className="product-image">
                                    <FaImage />
                                  </div>
                                </td>
                                <td>
                                  <div className="product-info">
                                    <strong>
                                      {product.nombre || product.marca}
                                    </strong>
                                    <small>
                                      {product.descripcion || "Sin descripción"}
                                    </small>
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
                                      ? t("adminPanel.products.active")
                                      : t("adminPanel.products.inactive")}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="btn-icon"
                                      onClick={() =>
                                        handleManageProduct(product)
                                      }
                                      data-product-id={product.idProducto}
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className="btn-icon"
                                      onClick={() =>
                                        handleDeleteProduct(product.idProducto)
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
                        <h2>{t("adminPanel.users.management")}</h2>
                        <div className="search-box">
                          <FaSearch />
                          <input
                            type="text"
                            placeholder={t(
                              "adminPanel.users.searchPlaceholder"
                            )}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="users-table">
                        <table>
                          <thead>
                            <tr>
                              <th>{t("adminPanel.users.user")}</th>
                              <th>{t("adminPanel.users.email")}</th>
                              <th>{t("adminPanel.users.role")}</th>
                              <th>{t("adminPanel.users.registration")}</th>
                              <th>{t("adminPanel.users.purchases")}</th>
                              <th>{t("adminPanel.users.status")}</th>
                              <th>{t("adminPanel.users.actions")}</th>
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
                                  <span
                                    className={`status-badge ${user.status}`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="btn-icon"
                                      title="Ver usuario"
                                    >
                                      <FaEye />
                                    </button>
                                    <button
                                      className="btn-icon"
                                      title="Editar usuario"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className="btn-icon btn-danger"
                                      onClick={() =>
                                        handleDeleteUser(parseInt(user.id))
                                      }
                                      title="Eliminar usuario"
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

                  {activeTab === "orders" && (
                    <div className="orders-section">
                      <div className="section-header">
                        <h2>{t("adminPanel.orders.management")}</h2>
                        <div className="search-box">
                          <FaSearch />
                          <input
                            type="text"
                            placeholder={t(
                              "adminPanel.orders.searchPlaceholder"
                            )}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="orders-table">
                        <table>
                          <thead>
                            <tr>
                              <th>{t("adminPanel.orders.orderId")}</th>
                              <th>{t("adminPanel.orders.customer")}</th>
                              <th>{t("adminPanel.orders.date")}</th>
                              <th>{t("adminPanel.orders.total")}</th>
                              <th>{t("adminPanel.orders.status")}</th>
                              <th>{t("adminPanel.orders.actions")}</th>
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
                      <h2>{t("adminPanel.settings.systemConfig")}</h2>
                      <div className="settings-grid">
                        <div className="setting-card">
                          <h3>{t("adminPanel.settings.databaseManagement")}</h3>
                          <p>{t("adminPanel.settings.databaseDescription")}</p>
                          <div className="setting-actions">
                            <button
                              className="btn-secondary"
                              onClick={() => handleBackupDatabase()}
                            >
                              {t("adminPanel.settings.backupDatabase")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={() => handleOptimizeDatabase()}
                            >
                              {t("adminPanel.settings.optimizeDatabase")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={() => handleViewDatabaseStats()}
                            >
                              {t("adminPanel.settings.viewStats")}
                            </button>
                          </div>
                        </div>
                        <div className="setting-card">
                          <h3>{t("adminPanel.settings.userManagement")}</h3>
                          <p>{t("adminPanel.settings.userDescription")}</p>
                          <div className="setting-actions">
                            <button
                              className="btn-secondary"
                              onClick={handleCreateUser}
                            >
                              {t("adminPanel.settings.createUser")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleManageRoles}
                            >
                              {t("adminPanel.settings.manageRoles")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleViewLogs}
                            >
                              {t("adminPanel.settings.viewLogs")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleValidateEndpoints}
                            >
                              🔍 Validar Endpoints
                            </button>
                          </div>
                        </div>
                        <div className="setting-card">
                          <h3>{t("adminPanel.settings.productManagement")}</h3>
                          <p>{t("adminPanel.settings.productDescription")}</p>
                          <div className="setting-actions">
                            <button
                              className="btn-secondary"
                              onClick={handleImportProducts}
                            >
                              {t("adminPanel.settings.importProducts")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleExportCatalog}
                            >
                              {t("adminPanel.settings.exportCatalog")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleManageTypes}
                            >
                              {t("adminPanel.settings.manageTypes")}
                            </button>
                          </div>
                        </div>
                        <div className="setting-card">
                          <h3>
                            {t("adminPanel.settings.systemConfiguration")}
                          </h3>
                          <p>{t("adminPanel.settings.systemDescription")}</p>
                          <div className="setting-actions">
                            <button
                              className="btn-secondary"
                              onClick={handleConfigureEmail}
                            >
                              {t("adminPanel.settings.configureEmail")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleConfigurePayments}
                            >
                              {t("adminPanel.settings.configurePayments")}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleConfigureShipping}
                            >
                              {t("adminPanel.settings.configureShipping")}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="system-info">
                        <h3>{t("adminPanel.settings.systemInfo")}</h3>
                        <div className="info-grid">
                          <div className="info-item">
                            <label>
                              {t("adminPanel.settings.systemVersion")}:
                            </label>
                            <span>1.0.0</span>
                          </div>
                          <div className="info-item">
                            <label>
                              {t("adminPanel.settings.lastBackup")}:
                            </label>
                            <span>2024-01-15 14:30:00</span>
                          </div>
                          <div className="info-item">
                            <label>
                              {t("adminPanel.settings.activeUsers")}:
                            </label>
                            <span>{stats?.totalUsers || 0}</span>
                          </div>
                          <div className="info-item">
                            <label>
                              {t("adminPanel.settings.productsInCatalog")}:
                            </label>
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
          {showProductManagement && (
            <div className="modal-overlay">
              <div className="product-form-modal">
                <div className="modal-header">
                  <h3>
                    {editingProduct
                      ? t("adminPanel.products.editProduct")
                      : t("adminPanel.products.newProduct")}
                  </h3>
                  <button
                    className="close-btn"
                    onClick={() => {
                      setShowProductManagement(false);
                      setEditingProduct(null);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-content">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t("adminPanel.products.productName")}</label>
                      <input
                        type="text"
                        value={productForm.nombre}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            nombre: e.target.value,
                          })
                        }
                        placeholder={t(
                          "adminPanel.products.productNamePlaceholder"
                        )}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("adminPanel.products.brand")}</label>
                      <input
                        type="text"
                        value={productForm.marca}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            marca: e.target.value,
                          })
                        }
                        placeholder={t("adminPanel.products.brandPlaceholder")}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("adminPanel.products.price")}</label>
                      <input
                        type="number"
                        value={productForm.precio}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            precio: e.target.value,
                          })
                        }
                        placeholder={t("adminPanel.products.pricePlaceholder")}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("adminPanel.products.stock")}</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        placeholder={t("adminPanel.products.stockPlaceholder")}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("adminPanel.products.color")}</label>
                      <input
                        type="text"
                        value={productForm.color}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            color: e.target.value,
                          })
                        }
                        placeholder={t("adminPanel.products.colorPlaceholder")}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("adminPanel.products.size")}</label>
                      <input
                        type="text"
                        value={productForm.talla}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            talla: e.target.value,
                          })
                        }
                        placeholder={t("adminPanel.products.sizePlaceholder")}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>{t("adminPanel.products.description")}</label>
                      <textarea
                        value={productForm.descripcion}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            descripcion: e.target.value,
                          })
                        }
                        placeholder={t(
                          "adminPanel.products.descriptionPlaceholder"
                        )}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowProductManagement(false);
                      setEditingProduct(null);
                    }}
                  >
                    <FaTimes />
                    {t("common.cancel")}
                  </button>
                  <button className="btn-primary" onClick={handleSaveProduct}>
                    <FaSave />
                    {editingProduct
                      ? t("common.update")
                      : t("common.create")}{" "}
                    {t("adminPanel.products.product")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Management Modal */}
      <ProductManagementModal
        isOpen={showProductManagement}
        onClose={() => {
          setShowProductManagement(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onProductSaved={() => {
          handleProductSaved();
          if (onProductUpdated) {
            onProductUpdated();
          }
        }}
      />

      {/* Beautiful Alert */}
      <BeautifulAlert
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
        onConfirm={alertState.onConfirm}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </>
  );
};

export default AdminPanel;