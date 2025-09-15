package co.edu.TekashiShoes.modelos;

import java.time.LocalDateTime;

public class Notificacion {
    private int id;
    private int usuarioId;
    private String titulo;
    private String mensaje;
    private String tipo;
    private boolean leida;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaLectura;
    private String urlAccion;

    // Constructores
    public Notificacion() {
        this.leida = false;
        this.fechaCreacion = LocalDateTime.now();
    }

    public Notificacion(int usuarioId, String titulo, String mensaje, String tipo) {
        this();
        this.usuarioId = usuarioId;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.tipo = tipo;
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isLeida() {
        return leida;
    }

    public void setLeida(boolean leida) {
        this.leida = leida;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaLectura() {
        return fechaLectura;
    }

    public void setFechaLectura(LocalDateTime fechaLectura) {
        this.fechaLectura = fechaLectura;
    }

    public String getUrlAccion() {
        return urlAccion;
    }

    public void setUrlAccion(String urlAccion) {
        this.urlAccion = urlAccion;
    }

    @Override
    public String toString() {
        return "Notificacion{" +
                "id=" + id +
                ", usuarioId=" + usuarioId +
                ", titulo='" + titulo + '\'' +
                ", mensaje='" + mensaje + '\'' +
                ", tipo='" + tipo + '\'' +
                ", leida=" + leida +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaLectura=" + fechaLectura +
                ", urlAccion='" + urlAccion + '\'' +
                '}';
    }
}

