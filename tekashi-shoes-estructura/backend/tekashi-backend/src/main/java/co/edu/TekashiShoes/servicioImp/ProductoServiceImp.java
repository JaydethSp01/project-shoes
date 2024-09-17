/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package co.edu.TekashiShoes.servicioImp;

/**
 *
 * @author santiago
 */



import co.edu.TekashiShoes.dominio.Producto;
import co.edu.TekashiShoes.repositorios.ProductoRepositorio;
import co.edu.TekashiShoes.servicios.ProductoServicio;
import java.sql.SQLException;
import java.util.List;

public class ProductoServiceImp implements ProductoServicio {
    private ProductoRepositorio productoRepositorio;

    public ProductoServiceImp(ProductoRepositorio productoRepositorio) {
        this.productoRepositorio = productoRepositorio;
    }

    @Override
    public List<Producto> listarProductos() throws SQLException {
        return productoRepositorio.obtenerTodos();
    }

    @Override
    public Producto obtenerProductoPorId(int id) throws SQLException {
        return productoRepositorio.obtenerPorId(id);
    }

    @Override
    public void agregarProducto(Producto producto) throws SQLException {
        productoRepositorio.guardar(producto);
    }

    @Override
    public void actualizarProducto(int id, Producto producto) throws SQLException {
        productoRepositorio.actualizar(id, producto);
    }

    @Override
    public void eliminarProducto(int id) throws SQLException {
        productoRepositorio.eliminar(id);
    }
}
