package co.edu.TekashiShoes.repositorios;

import co.edu.TekashiShoes.dominio.Producto;
import co.edu.TekashiShoes.dominio.TipoProducto;
import co.edu.TekashiShoes.dominio.Imagen;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoRepositorio {
    private Connection conexion;

    public ProductoRepositorio() throws SQLException {
        this.conexion = DriverManager.getConnection("jdbc:mysql://localhost:3306/tekashi_shoes_bd", "root", "");
    }

    // CRUD para Producto

    public void insertarProducto(Producto producto) throws SQLException {
        String sql = "INSERT INTO producto (tipo_producto_id, marca, color, precio, stock, id_imagen) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, producto.getTipoProductoId());
            stmt.setString(2, producto.getMarca());
            stmt.setString(3, producto.getColor());
            stmt.setDouble(4, producto.getPrecio());
            stmt.setInt(5, producto.getStock());
            stmt.setInt(6, producto.getImagenId());
            stmt.executeUpdate();
        }
    }

    public List<Producto> listarProductos() throws SQLException {
        String sql = "SELECT * FROM producto";
        List<Producto> productos = new ArrayList<>();
        try (Statement stmt = conexion.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                productos.add(new Producto(
                        rs.getInt("id_producto"),
                        rs.getInt("tipo_producto_id"),
                        rs.getString("marca"),
                        rs.getString("color"),
                        rs.getDouble("precio"),
                        rs.getInt("stock"),
                        rs.getInt("id_imagen")
                ));
            }
        }
        return productos;
    }

    public Producto ListarPorId(int id) throws SQLException {
        Producto producto = null;
        String query = "SELECT * FROM producto WHERE id_producto = ?";

        try (PreparedStatement statement = conexion.prepareStatement(query)) {
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                producto = new Producto(
                    resultSet.getInt("id_producto"),
                    resultSet.getInt("tipo_producto_id"),
                    resultSet.getString("marca"),
                    resultSet.getString("color"),
                    resultSet.getDouble("precio"),
                    resultSet.getInt("stock"),
                    resultSet.getInt("id_imagen")
                );
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener producto por ID: " + e.getMessage());
            throw e;
        }
        return producto;
    }

    public void actualizarProducto(int id, Producto producto) throws SQLException {
        String sql = "UPDATE producto SET tipo_producto_id=?, marca=?, color=?, precio=?, stock=?, id_imagen=? WHERE id_producto=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, producto.getTipoProductoId());
            stmt.setString(2, producto.getMarca());
            stmt.setString(3, producto.getColor());
            stmt.setDouble(4, producto.getPrecio());
            stmt.setInt(5, producto.getStock());
            stmt.setInt(6, producto.getImagenId());
            stmt.setInt(7, id);
            stmt.executeUpdate();
        }
    }

    public void eliminarProducto(int id) throws SQLException {
        String sql = "DELETE FROM producto WHERE id_producto=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    // CRUD para TipoProducto

    public void insertarTipoProducto(TipoProducto tipoProducto) throws SQLException {
        String sql = "INSERT INTO tipo_producto (nombre) VALUES (?)";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, tipoProducto.getNombre());
            stmt.executeUpdate();
        }
    }

    public List<TipoProducto> listarTiposProducto() throws SQLException {
        String sql = "SELECT * FROM tipo_producto";
        List<TipoProducto> tiposProducto = new ArrayList<>();
        try (Statement stmt = conexion.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                tiposProducto.add(new TipoProducto(
                        rs.getInt("id_tipo_producto"),
                        rs.getString("nombre")
                ));
            }
        }
        return tiposProducto;
    }

    public void actualizarTipoProducto(int id, TipoProducto tipoProducto) throws SQLException {
        String sql = "UPDATE tipo_producto SET nombre=? WHERE id_tipo_producto=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, tipoProducto.getNombre());
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    public void eliminarTipoProducto(int id) throws SQLException {
        String sql = "DELETE FROM tipo_producto WHERE id_tipo_producto=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    // CRUD para Imagen

    public void insertarImagen(Imagen imagen) throws SQLException {
        String sql = "INSERT INTO imagen (imagen) VALUES (?)";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, imagen.getImagenBase64());
            stmt.executeUpdate();
        }
    }

    public List<Imagen> listarImagenes() throws SQLException {
        String sql = "SELECT * FROM imagen";
        List<Imagen> imagenes = new ArrayList<>();
        try (Statement stmt = conexion.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                imagenes.add(new Imagen(
                        rs.getInt("id_imagen"),
                        rs.getString("imagen")
                ));
            }
        }
        return imagenes;
    }

    public void actualizarImagen(int id, Imagen imagen) throws SQLException {
        String sql = "UPDATE imagen SET imagen=? WHERE id_imagen=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, imagen.getImagenBase64());
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    public void eliminarImagen(int id) throws SQLException {
        String sql = "DELETE FROM imagen WHERE id_imagen=?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    public Imagen obtenerImagenPorTipoProducto(int tipoProductoId) throws SQLException {
        String sql = "SELECT img.* FROM imagen img JOIN producto prod ON img.id_imagen = prod.id_imagen WHERE prod.tipo_producto_id = ?";
        Imagen imagen = null;
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, tipoProductoId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    imagen = new Imagen(
                        rs.getInt("id_imagen"),
                        rs.getString("imagen")
                    );
                }
            }
        }
        return imagen;
    }
}
