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
    private ProductoRepositorio repositorio;
    
    public ProductoServiceImp(ProductoRepositorio repositorio) {
        this.repositorio = repositorio;
    }
    
    @Override
    public void agregarProducto(Producto producto) throws SQLException {
        repositorio.insertarProducto(producto);
    }
    
     @Override
    public List<Producto> listarProductos() throws SQLException {
        return repositorio.listarProductos();
    }

    public void actualizarProducto(int id, Producto producto) throws SQLException {
        repositorio.actualizarProducto(id, producto);
    }

    public void eliminarProducto(int id) throws SQLException {
        repositorio.eliminarProducto(id);
    }
    
    @Override
    public Producto obtenerProductoPorId(int id) throws SQLException{
        return repositorio.ListarPorId(id);
    }
    
    
}