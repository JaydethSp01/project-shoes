package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.modelos.Favorito;

import java.sql.SQLException;
import java.util.List;

public interface FavoritoServicio {
    Favorito crear(Favorito favorito) throws SQLException;
    Favorito buscarPorId(int id) throws SQLException;
    List<Favorito> listarTodos() throws SQLException;
    List<Favorito> listarPorUsuario(int usuarioId) throws SQLException;
    List<Favorito> listarPorProducto(int productoId) throws SQLException;
    boolean eliminar(int usuarioId, int productoId) throws SQLException;
    boolean eliminarPorId(int id) throws SQLException;
    boolean existeFavorito(int usuarioId, int productoId) throws SQLException;
    int contarFavoritosPorUsuario(int usuarioId) throws SQLException;
}

