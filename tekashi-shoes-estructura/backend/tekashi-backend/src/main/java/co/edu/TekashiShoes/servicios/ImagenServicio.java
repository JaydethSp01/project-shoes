/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.dominio.Imagen;

import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author santiago
 */


public interface ImagenServicio {
    int agregarImagen(Imagen imagen) throws SQLException;
    Imagen  obtenerImagen(int id) throws SQLException;
    void actualizarImagen(int id, Imagen imagen) throws SQLException;
    void eliminarImagen(int id) throws SQLException;
    Imagen obtenerImagenPorTipoProducto(int tipoProductoId) throws SQLException;
}