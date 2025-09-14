package co.edu.TekashiShoes.repositorios;

import co.edu.TekashiShoes.modelos.Usuario;
import co.edu.TekashiShoes.utilidades.ConexionBD;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UsuarioRepositorio {
    private static final String URL = "jdbc:mysql://localhost:3306/tekashi_shoes_bd";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "";

    public Usuario crear(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuario (nombre, email, password, telefono, direccion, rol, fecha_registro, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getPassword());
            stmt.setString(4, usuario.getTelefono());
            stmt.setString(5, usuario.getDireccion());
            stmt.setString(6, usuario.getRol() != null ? usuario.getRol().toUpperCase() : "CLIENTE");
            stmt.setDate(7, Date.valueOf(java.time.LocalDate.now()));
            stmt.setBoolean(8, usuario.getEstado() != null && usuario.getEstado().equals("activo"));

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        usuario.setId(generatedKeys.getInt(1));
                        return usuario;
                    }
                }
            }
        }
        return null;
    }

    public Usuario buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearUsuario(rs);
                }
            }
        }
        return null;
    }

    public Usuario buscarPorEmail(String email) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE email = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearUsuario(rs);
                }
            }
        }
        return null;
    }

    public List<Usuario> listarTodos() throws SQLException {
        String sql = "SELECT * FROM usuario ORDER BY fecha_registro DESC";
        List<Usuario> usuarios = new ArrayList<>();
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                usuarios.add(mapearUsuario(rs));
            }
        }
        return usuarios;
    }

    public Usuario actualizar(Usuario usuario) throws SQLException {
        String sql = "UPDATE usuario SET nombre = ?, email = ?, password = ?, telefono = ?, direccion = ?, rol = ?, ultimo_login = ?, estado = ?, puntos_fidelidad = ?, nivel_usuario = ? WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getPassword());
            stmt.setString(4, usuario.getTelefono());
            stmt.setString(5, usuario.getDireccion());
            stmt.setString(6, usuario.getRol());
            stmt.setTimestamp(7, usuario.getUltimoLogin() != null ? Timestamp.valueOf(usuario.getUltimoLogin()) : null);
            stmt.setString(8, usuario.getEstado());
            stmt.setInt(9, usuario.getPuntosFidelidad());
            stmt.setString(10, usuario.getNivelUsuario());
            stmt.setInt(11, usuario.getId());

            int filasAfectadas = stmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                return usuario;
            }
        }
        return null;
    }

    public boolean eliminar(int id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean existeEmail(String email) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE email = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    public int contarUsuarios() throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    public int contarUsuariosActivos() throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE activo = true";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    public int contarNuevosUsuariosMes() throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    public boolean actualizarUltimoLogin(int id) throws SQLException {
        String sql = "UPDATE usuario SET ultimo_login = NOW() WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean agregarPuntosFidelidad(int id, int puntos) throws SQLException {
        String sql = "UPDATE usuario SET puntos_fidelidad = puntos_fidelidad + ? WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, puntos);
            stmt.setInt(2, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    public boolean actualizarNivelUsuario(int id, String nivel) throws SQLException {
        String sql = "UPDATE usuario SET nivel_usuario = ? WHERE id_usuario = ?";
        
        try (Connection conn = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, nivel);
            stmt.setInt(2, id);
            int filasAfectadas = stmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }

    private Usuario mapearUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getInt("id_usuario"));
        usuario.setNombre(rs.getString("nombre"));
        usuario.setEmail(rs.getString("email"));
        usuario.setPassword(rs.getString("password"));
        usuario.setTelefono(rs.getString("telefono"));
        usuario.setDireccion(rs.getString("direccion"));
        usuario.setRol(rs.getString("rol").toLowerCase());
        
        Date fechaRegistro = rs.getDate("fecha_registro");
        if (fechaRegistro != null) {
            usuario.setFechaRegistro(fechaRegistro.toString());
        }
        
        usuario.setEstado(rs.getBoolean("activo") ? "activo" : "inactivo");
        // Campos que no existen en la tabla actual - usar valores por defecto
        usuario.setPuntosFidelidad(0);
        usuario.setNivelUsuario("bronce");
        
        return usuario;
    }
}
