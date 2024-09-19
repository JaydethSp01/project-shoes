/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.TekashiShoes.servicios;

/**
 *
 * @author santiago
 */



import co.edu.TekashiShoes.dominio.Producto;
import java.sql.SQLException;
import java.util.List;

public interface ProductoServicio {
    List<Producto> listarProductos() throws SQLException;
    Producto obtenerProductoPorId(int id) throws SQLException;
    void agregarProducto(Producto producto) throws SQLException;
    void actualizarProducto(int id, Producto producto) throws SQLException;
    void eliminarProducto(int id) throws SQLException;
}
