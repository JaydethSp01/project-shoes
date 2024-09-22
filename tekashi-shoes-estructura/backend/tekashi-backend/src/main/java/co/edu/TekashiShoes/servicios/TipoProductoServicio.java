/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.dominio.TipoProducto;

import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author Manuel
 */

public interface TipoProductoServicio {
    List<TipoProducto> listarTiposProducto() throws SQLException;
}