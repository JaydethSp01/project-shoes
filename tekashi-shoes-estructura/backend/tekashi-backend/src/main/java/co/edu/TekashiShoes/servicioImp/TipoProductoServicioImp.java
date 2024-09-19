/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.repositorios.ProductoRepositorio;
import co.edu.TekashiShoes.dominio.TipoProducto;
import co.edu.TekashiShoes.servicios.TipoProductoServicio;

import java.sql.SQLException;
import java.util.List;
/**
 *
 * @author santiago
 */

public class TipoProductoServicioImp implements TipoProductoServicio {
    private ProductoRepositorio repositorio;

    public TipoProductoServicioImp(ProductoRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public void agregarTipoProducto(TipoProducto tipoProducto) throws SQLException {
        repositorio.insertarTipoProducto(tipoProducto);
    }

    public List<TipoProducto> listarTiposProducto() throws SQLException {
        return repositorio.listarTiposProducto();
    }

    public void actualizarTipoProducto(int id, TipoProducto tipoProducto) throws SQLException {
        repositorio.actualizarTipoProducto(id, tipoProducto);
    }

    public void eliminarTipoProducto(int id) throws SQLException {
        repositorio.eliminarTipoProducto(id);
    }
}