package co.edu.TekashiShoes.repositorios;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ActivityTrackingRepositorio {
    private Connection conexion;

    public ActivityTrackingRepositorio() throws SQLException {
        this.conexion = DriverManager.getConnection("jdbc:mysql://localhost:3306/tekashi_shoes_bd", "root", "");
    }

    // Insertar nueva actividad
    public void insertarActividad(int userId, String activityType, String description, Map<String, Object> metadata, String ipAddress) throws SQLException {
        String sql = "INSERT INTO activity_tracking (user_id, activity_type, activity_description, metadata, ip_address) VALUES (?, ?, ?, ?, ?)";
        
        Gson gson = new Gson();
        String metadataJson = gson.toJson(metadata);
        
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, activityType);
            stmt.setString(3, description);
            stmt.setString(4, metadataJson);
            stmt.setString(5, ipAddress);
            stmt.executeUpdate();
        }
    }

    // Obtener notificaciones para admin
    public List<Map<String, Object>> obtenerNotificacionesAdmin(int limit) throws SQLException {
        List<Map<String, Object>> notificaciones = new ArrayList<>();
        
        String sql = "SELECT * FROM admin_notifications LIMIT ?";
        
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, limit);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> notificacion = Map.of(
                    "id_activity", rs.getInt("id_activity"),
                    "user_id", rs.getInt("user_id"),
                    "activity_type", rs.getString("activity_type"),
                    "activity_description", rs.getString("activity_description"),
                    "metadata", rs.getString("metadata"),
                    "created_at", rs.getTimestamp("created_at").toString(),
                    "is_read", rs.getBoolean("is_read"),
                    "user_name", rs.getString("user_name") != null ? rs.getString("user_name") : "Usuario del sistema",
                    "notification_title", rs.getString("notification_title"),
                    "notification_type", rs.getString("notification_type")
                );
                notificaciones.add(notificacion);
            }
        }
        
        return notificaciones;
    }

    // Marcar notificación como leída
    public void marcarComoLeida(int activityId) throws SQLException {
        String sql = "UPDATE activity_tracking SET is_read = TRUE WHERE id_activity = ?";
        
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, activityId);
            stmt.executeUpdate();
        }
    }

    // Marcar todas las notificaciones como leídas
    public void marcarTodasComoLeidas() throws SQLException {
        String sql = "UPDATE activity_tracking SET is_read = TRUE WHERE is_read = FALSE";
        
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.executeUpdate();
        }
    }

    // Obtener estadísticas de actividades
    public Map<String, Object> obtenerEstadisticasActividades() throws SQLException {
        String sql = "SELECT " +
                    "COUNT(*) as total_actividades, " +
                    "SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as actividades_no_leidas, " +
                    "SUM(CASE WHEN activity_type = 'login' THEN 1 ELSE 0 END) as logins, " +
                    "SUM(CASE WHEN activity_type = 'purchase' THEN 1 ELSE 0 END) as compras, " +
                    "SUM(CASE WHEN activity_type = 'register' THEN 1 ELSE 0 END) as registros " +
                    "FROM activity_tracking";
        
        try (Statement stmt = conexion.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return Map.of(
                    "total_actividades", rs.getInt("total_actividades"),
                    "actividades_no_leidas", rs.getInt("actividades_no_leidas"),
                    "logins", rs.getInt("logins"),
                    "compras", rs.getInt("compras"),
                    "registros", rs.getInt("registros")
                );
            }
        }
        
        return Map.of(
            "total_actividades", 0,
            "actividades_no_leidas", 0,
            "logins", 0,
            "compras", 0,
            "registros", 0
        );
    }

    // Eliminar actividades antiguas (más de 30 días)
    public int limpiarActividadesAntiguas() throws SQLException {
        String sql = "DELETE FROM activity_tracking WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)";
        
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            return stmt.executeUpdate();
        }
    }

    public void cerrar() {
        try {
            if (conexion != null && !conexion.isClosed()) {
                conexion.close();
            }
        } catch (SQLException e) {
            System.err.println("Error cerrando conexión: " + e.getMessage());
        }
    }
}

