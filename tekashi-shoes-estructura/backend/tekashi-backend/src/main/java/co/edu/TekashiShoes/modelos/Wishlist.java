package co.edu.TekashiShoes.modelos;

import java.time.LocalDateTime;
import java.util.List;

public class Wishlist {
    private int id;
    private int usuarioId;
    private String nombre;
    private String descripcion;
    private String fechaCreacion;
    private String fechaActualizacion;
    private boolean isPublic;
    private List<Object> productos;

    // Constructores
    public Wishlist() {
        this.fechaCreacion = LocalDateTime.now().toString();
        this.fechaActualizacion = LocalDateTime.now().toString();
        this.isPublic = false;
    }

    public Wishlist(int usuarioId, String nombre, String descripcion) {
        this();
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.descripcion = descripcion;
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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(String fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<Object> getProductos() {
        return productos;
    }

    public void setProductos(List<Object> productos) {
        this.productos = productos;
    }

    @Override
    public String toString() {
        return "Wishlist{" +
                "id=" + id +
                ", usuarioId=" + usuarioId +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaActualizacion=" + fechaActualizacion +
                ", isPublic=" + isPublic +
                '}';
    }
}
