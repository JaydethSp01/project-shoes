package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.modelos.Favorito;
import co.edu.TekashiShoes.repositorios.FavoritoRepositorio;
import co.edu.TekashiShoes.servicios.FavoritoServicio;

import java.sql.SQLException;
import java.util.List;

public class FavoritoServicioImp implements FavoritoServicio {
    private final FavoritoRepositorio repositorio;

    public FavoritoServicioImp() {
        this.repositorio = new FavoritoRepositorio();
    }

    @Override
    public Favorito crear(Favorito favorito) throws SQLException {
        return repositorio.crear(favorito);
    }

    @Override
    public Favorito buscarPorId(int id) throws SQLException {
        return repositorio.buscarPorId(id);
    }

    @Override
    public List<Favorito> listarTodos() throws SQLException {
        return repositorio.listarTodos();
    }

    @Override
    public List<Favorito> listarPorUsuario(int usuarioId) throws SQLException {
        return repositorio.listarPorUsuario(usuarioId);
    }

    @Override
    public List<Favorito> listarPorProducto(int productoId) throws SQLException {
        return repositorio.listarPorProducto(productoId);
    }

    @Override
    public boolean eliminar(int usuarioId, int productoId) throws SQLException {
        return repositorio.eliminar(usuarioId, productoId);
    }

    @Override
    public boolean eliminarPorId(int id) throws SQLException {
        return repositorio.eliminarPorId(id);
    }

    @Override
    public boolean existeFavorito(int usuarioId, int productoId) throws SQLException {
        return repositorio.existeFavorito(usuarioId, productoId);
    }

    @Override
    public int contarFavoritosPorUsuario(int usuarioId) throws SQLException {
        return repositorio.contarFavoritosPorUsuario(usuarioId);
    }
}
