/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.TekashiShoes.repositorios;

/**
 *
 * @author santiago
 */


import co.edu.TekashiShoes.dominio.Producto;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoRepositorio {
    private Connection conexion;

    public ProductoRepositorio() throws SQLException {
        String url = "jdbc:mysql://localhost:3306/tekashi_shoes_bd";
        String usuario = "root";
        String contraseña = "";
        conexion = DriverManager.getConnection(url, usuario, contraseña);
    }

    public List<Producto> obtenerTodos() throws SQLException {
        String consulta = "SELECT * FROM producto";
        Statement sentencia = conexion.createStatement();
        ResultSet resultado = sentencia.executeQuery(consulta);

        List<Producto> productos = new ArrayList<>();
        while (resultado.next()) {
            Producto producto = new Producto(
                resultado.getInt("idProducto"),
                resultado.getInt("tipoProducto"),
                resultado.getString("marca"),
                resultado.getString("color"),
                resultado.getDouble("precio"),
                resultado.getInt("stock"),
                resultado.getInt("idImagen")
            );
            productos.add(producto);
        }

        return productos;
    }

    public Producto obtenerPorId(int id) throws SQLException {
        String consulta = "SELECT * FROM producto WHERE idProducto = ?";
        PreparedStatement sentencia = conexion.prepareStatement(consulta);
        sentencia.setInt(1, id);
        ResultSet resultado = sentencia.executeQuery();

        if (resultado.next()) {
            return new Producto(
                resultado.getInt("idProducto"),
                resultado.getInt("tipoProducto"),
                resultado.getString("marca"),
                resultado.getString("color"),
                resultado.getDouble("precio"),
                resultado.getInt("stock"),
                resultado.getInt("idImagen")
            );
        }

        return null;
    }

    public void guardar(Producto producto) throws SQLException {
        String consulta = "INSERT INTO producto (marca, color, precio, stock) VALUES (?, ?, ?, ?)";
        PreparedStatement sentencia = conexion.prepareStatement(consulta);
        sentencia.setString(1, producto.getMarca());
        sentencia.setString(2, producto.getColor());
        sentencia.setDouble(3, producto.getPrecio());
        sentencia.setInt(4, producto.getStock());
        sentencia.executeUpdate();
    }

    public void actualizar(int id, Producto producto) throws SQLException {
        String consulta = "UPDATE producto SET marca = ?, color = ?, precio = ?, stock = ? WHERE idProducto = ?";
        PreparedStatement sentencia = conexion.prepareStatement(consulta);
        sentencia.setString(1, producto.getMarca());
        sentencia.setString(2, producto.getColor());
        sentencia.setDouble(3, producto.getPrecio());
        sentencia.setInt(4, producto.getStock());
        sentencia.setInt(5, id);
        sentencia.executeUpdate();
    }

    public void eliminar(int id) throws SQLException {
        String consulta = "DELETE FROM producto WHERE idProducto = ?";
        PreparedStatement sentencia = conexion.prepareStatement(consulta);
        sentencia.setInt(1, id);
        sentencia.executeUpdate();
    }
}
