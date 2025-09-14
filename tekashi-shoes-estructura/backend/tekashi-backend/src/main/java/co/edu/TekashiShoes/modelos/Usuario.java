package co.edu.TekashiShoes.modelos;

import java.time.LocalDateTime;

public class Usuario {
    private int id;
    private String nombre;
    private String email;
    private String password;
    private String telefono;
    private String direccion;
    private String rol;
    private String fechaRegistro;
    private String ultimoLogin;
    private String estado;
    private int puntosFidelidad;
    private String nivelUsuario;

    // Constructores
    public Usuario() {
        this.fechaRegistro = LocalDateTime.now().toString();
        this.estado = "activo";
        this.puntosFidelidad = 0;
        this.nivelUsuario = "bronce";
    }

    public Usuario(String nombre, String email, String password, String telefono, String direccion, String rol) {
        this();
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.direccion = direccion;
        this.rol = rol;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(String fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getUltimoLogin() {
        return ultimoLogin;
    }

    public void setUltimoLogin(String ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public int getPuntosFidelidad() {
        return puntosFidelidad;
    }

    public void setPuntosFidelidad(int puntosFidelidad) {
        this.puntosFidelidad = puntosFidelidad;
    }

    public String getNivelUsuario() {
        return nivelUsuario;
    }

    public void setNivelUsuario(String nivelUsuario) {
        this.nivelUsuario = nivelUsuario;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", direccion='" + direccion + '\'' +
                ", rol='" + rol + '\'' +
                ", fechaRegistro=" + fechaRegistro +
                ", ultimoLogin=" + ultimoLogin +
                ", estado='" + estado + '\'' +
                ", puntosFidelidad=" + puntosFidelidad +
                ", nivelUsuario='" + nivelUsuario + '\'' +
                '}';
    }
}
