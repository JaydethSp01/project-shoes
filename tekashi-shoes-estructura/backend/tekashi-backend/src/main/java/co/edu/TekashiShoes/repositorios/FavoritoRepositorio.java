package co.edu.TekashiShoes.repositorios;

import co.edu.TekashiShoes.modelos.Favorito;
import co.edu.TekashiShoes.utilidades.ConexionBD;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class FavoritoRepositorio {
    
    public Favorito crear(Favorito favorito) throws SQLException {
        String sql = "INSERT INTO favoritos (id_usuario, id_producto, fecha_agregado) VALUES (?, ?, ?)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, favorito.getUsuarioId());
            stmt.setInt(2, favorito.getProductoId());
            stmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        favorito.setId(generatedKeys.getInt(1));
                        return favorito;
                    }
                }
            }
        }
        return null;
    }

    public Favorito buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM favoritos WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearFavorito(rs);
                }
            }
        }
        return null;
    }

    public List<Favorito> listarTodos() throws SQLException {
        String sql = "SELECT f.*, p.nombre as producto_nombre, p.marca, p.precio, p.imagen " +
                    "FROM favoritos f " +
                    "LEFT JOIN producto p ON f.producto_id = p.id " +
                    "ORDER BY f.fecha_agregado DESC";
        List<Favorito> favoritos = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                favoritos.add(mapearFavoritoConProducto(rs));
            }
        }
        return favoritos;
    }

    public List<Favorito> listarPorUsuario(int usuarioId) throws SQLException {
        String sql = "SELECT f.*, p.marca as producto_nombre, p.marca, p.precio, p.id_imagen as imagen " +
                    "FROM favoritos f " +
                    "LEFT JOIN producto p ON f.id_producto = p.id_producto " +
                    "WHERE f.id_usuario = ? " +
                    "ORDER BY f.fecha_agregado DESC";
        List<Favorito> favoritos = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    favoritos.add(mapearFavoritoConProducto(rs));
                }
            }
        }
        return favoritos;
    }

    public List<Favorito> listarPorProducto(int productoId) throws SQLException {
        String sql = "SELECT * FROM favoritos WHERE producto_id = ? ORDER BY fecha_agregado DESC";
        List<Favorito> favoritos = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, productoId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    favoritos.add(mapearFavorito(rs));
                }
            }
        }
        return favoritos;
    }

    public boolean eliminar(int usuarioId, int productoId) throws SQLException {
        String sql = "DELETE FROM favoritos WHERE id_usuario = ? AND id_producto = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            stmt.setInt(2, productoId);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean eliminarPorId(int id) throws SQLException {
        String sql = "DELETE FROM favoritos WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean existeFavorito(int usuarioId, int productoId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM favoritos WHERE usuario_id = ? AND producto_id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            stmt.setInt(2, productoId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    public int contarFavoritosPorUsuario(int usuarioId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM favoritos WHERE usuario_id = ?";
        
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

    private Favorito mapearFavorito(ResultSet rs) throws SQLException {
        Favorito favorito = new Favorito();
        favorito.setId(rs.getInt("id_favorito"));
        favorito.setUsuarioId(rs.getInt("id_usuario"));
        favorito.setProductoId(rs.getInt("id_producto"));
        
        Timestamp fechaAgregado = rs.getTimestamp("fecha_agregado");
        if (fechaAgregado != null) {
            favorito.setFechaAgregado(fechaAgregado.toString());
        }
        
        return favorito;
    }

    private Favorito mapearFavoritoConProducto(ResultSet rs) throws SQLException {
        Favorito favorito = mapearFavorito(rs);
        
        // Agregar información del producto si está disponible
        if (rs.getString("producto_nombre") != null) {
            // Aquí podrías crear un objeto Producto y asignarlo al favorito
            // Por ahora solo mapeamos la información básica
        }
        
        return favorito;
    }
}
