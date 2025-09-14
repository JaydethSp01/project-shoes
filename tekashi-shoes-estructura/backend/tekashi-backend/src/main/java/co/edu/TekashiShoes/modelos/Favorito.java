package co.edu.TekashiShoes.modelos;

import java.time.LocalDateTime;

public class Favorito {
    private int id;
    private int usuarioId;
    private int productoId;
    private String fechaAgregado;

    // Constructores
    public Favorito() {
        this.fechaAgregado = LocalDateTime.now().toString();
    }

    public Favorito(int usuarioId, int productoId) {
        this();
        this.usuarioId = usuarioId;
        this.productoId = productoId;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public int getProductoId() {
        return productoId;
    }

    public void setProductoId(int productoId) {
        this.productoId = productoId;
    }

    public String getFechaAgregado() {
        return fechaAgregado;
    }

    public void setFechaAgregado(String fechaAgregado) {
        this.fechaAgregado = fechaAgregado;
    }

    @Override
    public String toString() {
        return "Favorito{" +
                "id=" + id +
                ", usuarioId=" + usuarioId +
                ", productoId=" + productoId +
                ", fechaAgregado=" + fechaAgregado +
                '}';
    }
}
