package co.edu.TekashiShoes.repositorios;

import co.edu.TekashiShoes.modelos.Wishlist;
import co.edu.TekashiShoes.utilidades.ConexionBD;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class WishlistRepositorio {
    
    public Wishlist crear(Wishlist wishlist) throws SQLException {
        String sql = "INSERT INTO wishlists (usuario_id, nombre, descripcion, fecha_creacion, fecha_actualizacion) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, wishlist.getUsuarioId());
            stmt.setString(2, wishlist.getNombre());
            stmt.setString(3, wishlist.getDescripcion());
            stmt.setTimestamp(4, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        wishlist.setId(generatedKeys.getInt(1));
                        return wishlist;
                    }
                }
            }
        }
        return null;
    }

    public Wishlist buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM wishlists WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearWishlist(rs);
                }
            }
        }
        return null;
    }

    public List<Wishlist> listarTodos() throws SQLException {
        String sql = "SELECT w.*, COUNT(wp.producto_id) as producto_count " +
                    "FROM wishlists w " +
                    "LEFT JOIN wishlist_productos wp ON w.id = wp.wishlist_id " +
                    "GROUP BY w.id " +
                    "ORDER BY w.fecha_creacion DESC";
        List<Wishlist> wishlists = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                wishlists.add(mapearWishlist(rs));
            }
        }
        return wishlists;
    }

    public List<Wishlist> listarPorUsuario(int usuarioId) throws SQLException {
        String sql = "SELECT w.*, COUNT(wp.producto_id) as producto_count " +
                    "FROM wishlists w " +
                    "LEFT JOIN wishlist_productos wp ON w.id = wp.wishlist_id " +
                    "WHERE w.usuario_id = ? " +
                    "GROUP BY w.id " +
                    "ORDER BY w.fecha_creacion DESC";
        List<Wishlist> wishlists = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    wishlists.add(mapearWishlist(rs));
                }
            }
        }
        return wishlists;
    }

    public Wishlist actualizar(Wishlist wishlist) throws SQLException {
        String sql = "UPDATE wishlists SET nombre = ?, descripcion = ?, fecha_actualizacion = ? WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, wishlist.getNombre());
            stmt.setString(2, wishlist.getDescripcion());
            stmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setInt(4, wishlist.getId());

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                return wishlist;
            }
        }
        return null;
    }

    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM wishlists WHERE id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean agregarProducto(int wishlistId, int productoId) throws SQLException {
        String sql = "INSERT INTO wishlist_productos (wishlist_id, producto_id, fecha_agregado) VALUES (?, ?, ?)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, wishlistId);
            stmt.setInt(2, productoId);
            stmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));

            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean removerProducto(int wishlistId, int productoId) throws SQLException {
        String sql = "DELETE FROM wishlist_productos WHERE wishlist_id = ? AND producto_id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, wishlistId);
            stmt.setInt(2, productoId);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public int contarProductos(int wishlistId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM wishlist_productos WHERE wishlist_id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, wishlistId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    public boolean existeProductoEnWishlist(int wishlistId, int productoId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM wishlist_productos WHERE wishlist_id = ? AND producto_id = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, wishlistId);
            stmt.setInt(2, productoId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    private Wishlist mapearWishlist(ResultSet rs) throws SQLException {
        Wishlist wishlist = new Wishlist();
        wishlist.setId(rs.getInt("id"));
        wishlist.setUsuarioId(rs.getInt("usuario_id"));
        wishlist.setNombre(rs.getString("nombre"));
        wishlist.setDescripcion(rs.getString("descripcion"));
        
        Timestamp fechaCreacion = rs.getTimestamp("fecha_creacion");
        if (fechaCreacion != null) {
            wishlist.setFechaCreacion(fechaCreacion.toString());
        }
        
        Timestamp fechaActualizacion = rs.getTimestamp("fecha_actualizacion");
        if (fechaActualizacion != null) {
            wishlist.setFechaActualizacion(fechaActualizacion.toString());
        }
        
        return wishlist;
    }
}
