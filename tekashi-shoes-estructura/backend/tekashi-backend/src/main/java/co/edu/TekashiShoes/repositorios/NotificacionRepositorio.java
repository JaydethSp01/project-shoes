package co.edu.TekashiShoes.repositorios;

import co.edu.TekashiShoes.modelos.Notificacion;
import co.edu.TekashiShoes.utilidades.ConexionBD;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class NotificacionRepositorio {
    
    public Notificacion crear(Notificacion notificacion) throws SQLException {
        String sql = "INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida, fecha_creacion, url_accion) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, notificacion.getUsuarioId());
            stmt.setString(2, notificacion.getTitulo());
            stmt.setString(3, notificacion.getMensaje());
            stmt.setString(4, notificacion.getTipo());
            stmt.setBoolean(5, notificacion.isLeida());
            stmt.setTimestamp(6, Timestamp.valueOf(notificacion.getFechaCreacion()));
            stmt.setString(7, notificacion.getUrlAccion());

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        notificacion.setId(generatedKeys.getInt(1));
                        return notificacion;
                    }
                }
            }
        }
        return null;
    }

    public Notificacion buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM notificaciones WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearNotificacion(rs);
                }
            }
        }
        return null;
    }

    public List<Notificacion> listarTodos() throws SQLException {
        String sql = "SELECT * FROM notificaciones ORDER BY fecha_creacion DESC";
        List<Notificacion> notificaciones = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                notificaciones.add(mapearNotificacion(rs));
            }
        }
        return notificaciones;
    }

    public List<Notificacion> listarPorUsuario(int usuarioId) throws SQLException {
        String sql = "SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC";
        List<Notificacion> notificaciones = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    notificaciones.add(mapearNotificacion(rs));
                }
            }
        }
        return notificaciones;
    }

    public List<Notificacion> listarNoLeidas(int usuarioId) throws SQLException {
        String sql = "SELECT * FROM notificaciones WHERE usuario_id = ? AND leida = false ORDER BY fecha_creacion DESC";
        List<Notificacion> notificaciones = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    notificaciones.add(mapearNotificacion(rs));
                }
            }
        }
        return notificaciones;
    }

    public Notificacion actualizar(Notificacion notificacion) throws SQLException {
        String sql = "UPDATE notificaciones SET titulo = ?, mensaje = ?, tipo = ?, leida = ?, url_accion = ? WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, notificacion.getTitulo());
            stmt.setString(2, notificacion.getMensaje());
            stmt.setString(3, notificacion.getTipo());
            stmt.setBoolean(4, notificacion.isLeida());
            stmt.setString(5, notificacion.getUrlAccion());
            stmt.setInt(6, notificacion.getId());

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                return notificacion;
            }
        }
        return null;
    }

    public boolean marcarComoLeida(int id) throws SQLException {
        String sql = "UPDATE notificaciones SET leida = true, fecha_lectura = ? WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setInt(2, id);
            
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean marcarTodasComoLeidas(int usuarioId) throws SQLException {
        String sql = "UPDATE notificaciones SET leida = true, fecha_lectura = ? WHERE usuario_id = ? AND leida = false";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setInt(2, usuarioId);
            
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM notificaciones WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public int contarNoLeidas(int usuarioId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM notificaciones WHERE usuario_id = ? AND leida = false";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    private Notificacion mapearNotificacion(ResultSet rs) throws SQLException {
        Notificacion notificacion = new Notificacion();
        notificacion.setId(rs.getInt("id"));
        notificacion.setUsuarioId(rs.getInt("usuario_id"));
        notificacion.setTitulo(rs.getString("titulo"));
        notificacion.setMensaje(rs.getString("mensaje"));
        notificacion.setTipo(rs.getString("tipo"));
        notificacion.setLeida(rs.getBoolean("leida"));
        
        Timestamp fechaCreacion = rs.getTimestamp("fecha_creacion");
        if (fechaCreacion != null) {
            notificacion.setFechaCreacion(fechaCreacion.toLocalDateTime());
        }
        
        Timestamp fechaLectura = rs.getTimestamp("fecha_lectura");
        if (fechaLectura != null) {
            notificacion.setFechaLectura(fechaLectura.toLocalDateTime());
        }
        
        notificacion.setUrlAccion(rs.getString("url_accion"));
        
        return notificacion;
    }
}

