/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.TekashiShoes.dominio;

/**
 *
 * @author santiago
 */


public class Imagen {
    public int idImagen;
    private String imagenBase64;  // Imagen en formato Base64

    public Imagen(int idImagen, String imagenBase64) {
        this.idImagen = idImagen;
        this.imagenBase64 = imagenBase64;
    }

    // Getters y Setters
    public int getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(int idImagen) {
        this.idImagen = idImagen;
    }

    public String getImagenBase64() {
        return imagenBase64;
    }

    public void setImagenBase64(String imagenBase64) {
        this.imagenBase64 = imagenBase64;
    }
}