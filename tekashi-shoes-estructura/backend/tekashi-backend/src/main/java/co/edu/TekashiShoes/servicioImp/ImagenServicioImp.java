/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.repositorios.ProductoRepositorio;
import co.edu.TekashiShoes.dominio.Imagen;
import co.edu.TekashiShoes.servicios.ImagenServicio;

import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author santiago
 */

public class ImagenServicioImp implements ImagenServicio {
    private ProductoRepositorio repositorio;

    public ImagenServicioImp(ProductoRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public void agregarImagen(Imagen imagen) throws SQLException {
        repositorio.insertarImagen(imagen);
    }

    public List<Imagen> listarImagenes() throws SQLException {
        return repositorio.listarImagenes();
    }

    public void actualizarImagen(int id, Imagen imagen) throws SQLException {
        repositorio.actualizarImagen(id, imagen);
    }

    public void eliminarImagen(int id) throws SQLException {
        repositorio.eliminarImagen(id);
    }

    public Imagen obtenerImagenPorTipoProducto(int tipoProductoId) throws SQLException {
        return repositorio.obtenerImagenPorTipoProducto(tipoProductoId);
    }
}