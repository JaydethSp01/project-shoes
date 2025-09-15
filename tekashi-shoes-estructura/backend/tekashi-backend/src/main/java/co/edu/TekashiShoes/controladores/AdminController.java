package co.edu.TekashiShoes.controladores;

import co.edu.TekashiShoes.repositorios.*;
import co.edu.TekashiShoes.utilidades.ConexionBD;
import co.edu.TekashiShoes.dominio.Producto;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.*;
import java.sql.*;
import java.util.*;

public class AdminController {
    private Gson gson;
    private ActivityTrackingRepositorio activityRepo;
    private UsuarioRepositorio usuarioRepo;
    private ProductoRepositorio productoRepo;

    public AdminController() {
        this.gson = new Gson();
        try {
            this.activityRepo = new ActivityTrackingRepositorio();
            this.usuarioRepo = new UsuarioRepositorio();
            this.productoRepo = new ProductoRepositorio();
        } catch (SQLException e) {
            System.err.println("Error inicializando AdminController: " + e.getMessage());
        }
    }

    // Gestión de Base de Datos
    public String respaldarBaseDatos() {
        try {
            String timestamp = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss").format(new java.util.Date());
            String backupFile = "backup_tekashi_" + timestamp + ".sql";
            
            // Comando para crear respaldo
            ProcessBuilder pb = new ProcessBuilder(
                "mysqldump", 
                "-u", "root", 
                "--password=", 
                "tekashi_shoes_bd"
            );
            
            pb.redirectOutput(new File(backupFile));
            Process process = pb.start();
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                // Registrar actividad
                activityRepo.insertarActividad(1, "admin_action", "Respaldo de base de datos creado", 
                    Map.of("backup_file", backupFile), "127.0.0.1");
                
                return gson.toJson(Map.of("success", true, "message", "Respaldo creado exitosamente", "file", backupFile));
            } else {
                return gson.toJson(Map.of("success", false, "message", "Error al crear respaldo"));
            }
        } catch (Exception e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String optimizarBaseDatos() {
        try (Connection conn = ConexionBD.obtenerConexion()) {
            // Optimizar tablas principales
            String[] tablas = {"usuario", "producto", "pedido", "detalle_pedido", "activity_tracking"};
            
            for (String tabla : tablas) {
                String sql = "OPTIMIZE TABLE " + tabla;
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute(sql);
                }
            }
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Base de datos optimizada", 
                Map.of("tables_optimized", tablas.length), "127.0.0.1");
            
            return gson.toJson(Map.of("success", true, "message", "Base de datos optimizada exitosamente"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String verEstadisticasBaseDatos() {
        try (Connection conn = ConexionBD.obtenerConexion()) {
            Map<String, Object> estadisticas = new HashMap<>();
            
            // Estadísticas generales
            String sql = "SELECT " +
                        "(SELECT COUNT(*) FROM usuario) as total_usuarios, " +
                        "(SELECT COUNT(*) FROM producto) as total_productos, " +
                        "(SELECT COUNT(*) FROM pedido) as total_pedidos, " +
                        "(SELECT COUNT(*) FROM activity_tracking) as total_actividades, " +
                        "(SELECT SUM(precio * stock) FROM producto) as valor_inventario";
            
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next()) {
                    estadisticas.put("total_usuarios", rs.getInt("total_usuarios"));
                    estadisticas.put("total_productos", rs.getInt("total_productos"));
                    estadisticas.put("total_pedidos", rs.getInt("total_pedidos"));
                    estadisticas.put("total_actividades", rs.getInt("total_actividades"));
                    estadisticas.put("valor_inventario", rs.getDouble("valor_inventario"));
                }
            }
            
            // Estadísticas de actividad
            estadisticas.putAll(activityRepo.obtenerEstadisticasActividades());
            
            return gson.toJson(Map.of("success", true, "data", estadisticas));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    // Gestión de Usuarios
    public String crearUsuario(String nombre, String email, String password, String role) {
        try {
            usuarioRepo.crearUsuario(nombre, email, password, role);
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Usuario creado por admin", 
                Map.of("user_name", nombre, "email", email, "role", role), "127.0.0.1");
            
            return gson.toJson(Map.of("success", true, "message", "Usuario creado exitosamente"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String eliminarUsuario(int userId) {
        try {
            // Obtener información del usuario antes de eliminarlo
            Map<String, Object> userInfo = usuarioRepo.obtenerUsuarioPorId(userId);
            
            usuarioRepo.eliminarUsuario(userId);
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Usuario eliminado por admin", 
                Map.of("deleted_user_id", userId, "user_info", userInfo), "127.0.0.1");
            
            return gson.toJson(Map.of("success", true, "message", "Usuario eliminado exitosamente"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String gestionarRoles(int userId, String newRole) {
        try {
            usuarioRepo.actualizarRolUsuario(userId, newRole);
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Rol de usuario modificado", 
                Map.of("user_id", userId, "new_role", newRole), "127.0.0.1");
            
            return gson.toJson(Map.of("success", true, "message", "Rol actualizado exitosamente"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String verLogs() {
        try {
            List<Map<String, Object>> logs = activityRepo.obtenerNotificacionesAdmin(100);
            return gson.toJson(Map.of("success", true, "data", logs));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    // Gestión de Productos
    public String importarProductos(String productosJson) {
        try {
            JsonObject jsonObject = gson.fromJson(productosJson, JsonObject.class);
            
            if (!jsonObject.has("products")) {
                return gson.toJson(Map.of("success", false, "message", "Formato de archivo inválido. Se esperaba un array 'products'."));
            }
            
            JsonObject productsArray = jsonObject.getAsJsonObject("products");
            int importedCount = 0;
            int errorCount = 0;
            StringBuilder errors = new StringBuilder();
            
            // Procesar cada producto
            for (int i = 0; i < productsArray.size(); i++) {
                try {
                    JsonObject productJson = productsArray.getAsJsonObject(String.valueOf(i));
                    
                    // Crear producto desde JSON
                    Producto producto = new Producto(
                        0, // idProducto (se asignará automáticamente)
                        productJson.get("tipo_producto_id").getAsInt(),
                        productJson.get("marca").getAsString(),
                        productJson.get("color").getAsString(),
                        productJson.get("precio").getAsDouble(),
                        productJson.get("stock").getAsInt(),
                        productJson.has("id_imagen") ? productJson.get("id_imagen").getAsInt() : 1
                    );
                    
                    // Insertar producto
                    productoRepo.insertarProducto(producto);
                    importedCount++;
                    
                } catch (Exception e) {
                    errorCount++;
                    errors.append("Producto ").append(i + 1).append(": ").append(e.getMessage()).append("; ");
                }
            }
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Productos importados", 
                Map.of("imported_count", importedCount, "error_count", errorCount), "127.0.0.1");
            
            String message = String.format("Importación completada: %d productos importados, %d errores", 
                importedCount, errorCount);
            
            if (errorCount > 0) {
                message += ". Errores: " + errors.toString();
            }
            
            return gson.toJson(Map.of(
                "success", true, 
                "message", message,
                "imported_count", importedCount,
                "error_count", errorCount
            ));
        } catch (Exception e) {
            return gson.toJson(Map.of("success", false, "message", "Error al procesar archivo: " + e.getMessage()));
        }
    }

    public String exportarCatalogo() {
        try {
            List<Map<String, Object>> productos = productoRepo.listarProductosCompletos();
            
            // Crear estructura de exportación
            Map<String, Object> exportData = Map.of(
                "export_info", Map.of(
                    "timestamp", new java.util.Date().toString(),
                    "total_products", productos.size(),
                    "exported_by", "admin"
                ),
                "products", productos
            );
            
            String timestamp = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss").format(new java.util.Date());
            String exportFile = "catalogo_export_" + timestamp + ".json";
            
            // Escribir archivo JSON
            try (FileWriter writer = new FileWriter(exportFile)) {
                gson.toJson(exportData, writer);
            }
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Catálogo exportado", 
                Map.of("export_file", exportFile, "product_count", productos.size()), "127.0.0.1");
            
            return gson.toJson(Map.of(
                "success", true, 
                "message", "Catálogo exportado exitosamente", 
                "file", exportFile, 
                "count", productos.size(),
                "download_url", "/exports/" + exportFile
            ));
        } catch (Exception e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    // Notificaciones del Admin
    public String obtenerNotificacionesAdmin() {
        try {
            List<Map<String, Object>> notificaciones = activityRepo.obtenerNotificacionesAdmin(50);
            return gson.toJson(Map.of("success", true, "data", notificaciones));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String marcarNotificacionLeida(int activityId) {
        try {
            activityRepo.marcarComoLeida(activityId);
            return gson.toJson(Map.of("success", true, "message", "Notificación marcada como leída"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String marcarTodasNotificacionesLeidas() {
        try {
            activityRepo.marcarTodasComoLeidas();
            return gson.toJson(Map.of("success", true, "message", "Todas las notificaciones marcadas como leídas"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    // Información del Sistema
    public String obtenerInformacionSistema() {
        try (Connection conn = ConexionBD.obtenerConexion()) {
            Map<String, Object> info = new HashMap<>();
            
            // Versión del sistema
            info.put("version", "1.0.0");
            
            // Último respaldo
            String sql = "SELECT MAX(created_at) as last_backup FROM activity_tracking WHERE activity_type = 'admin_action' AND activity_description LIKE '%Respaldo%'";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next() && rs.getTimestamp("last_backup") != null) {
                    info.put("last_backup", rs.getTimestamp("last_backup").toString());
                } else {
                    info.put("last_backup", "Nunca");
                }
            }
            
            // Usuarios activos (usuarios con actividad en los últimos 7 días)
            sql = "SELECT COUNT(DISTINCT user_id) as active_users FROM activity_tracking WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next()) {
                    info.put("active_users", rs.getInt("active_users"));
                }
            }
            
            // Productos en catálogo
            sql = "SELECT COUNT(*) as total_products FROM producto";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next()) {
                    info.put("total_products", rs.getInt("total_products"));
                }
            }
            
            return gson.toJson(Map.of("success", true, "data", info));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String eliminarProducto(int productId) {
        try {
            // Obtener información del producto antes de eliminarlo
            Map<String, Object> productInfo = productoRepo.obtenerProductoPorId(productId);
            
            productoRepo.eliminarProducto(productId);
            
            // Registrar actividad
            activityRepo.insertarActividad(1, "admin_action", "Producto eliminado por admin", 
                Map.of("deleted_product_id", productId, "product_info", productInfo), "127.0.0.1");
            
            return gson.toJson(Map.of("success", true, "message", "Producto eliminado exitosamente"));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String obtenerListaUsuarios() {
        try {
            List<Map<String, Object>> usuarios = usuarioRepo.obtenerListaUsuarios();
            return gson.toJson(Map.of("success", true, "data", usuarios));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    public String obtenerListaProductos() {
        try {
            List<Map<String, Object>> productos = productoRepo.obtenerListaProductos();
            return gson.toJson(Map.of("success", true, "data", productos));
        } catch (SQLException e) {
            return gson.toJson(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

}
