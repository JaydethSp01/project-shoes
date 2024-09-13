package co.edu.backend_tekashi_shoes.dominios;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "tipo_producto")
public class Tipo_Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int ID_TIPOPRODUCTO;
    private String NOMBRE_PRODUCTO;

     //Getters y setters
    public int getID_TIPOPRODUCTO() {
        return ID_TIPOPRODUCTO;
    }
    public void setID_TIPOPRODUCTO(int iD_TIPOPRODUCTO) {
        ID_TIPOPRODUCTO = iD_TIPOPRODUCTO;
    }
    public String getNOMBRE_PRODUCTO() {
        return NOMBRE_PRODUCTO;
    }
    public void setNOMBRE_PRODUCTO(String nOMBRE_PRODUCTO) {
        NOMBRE_PRODUCTO = nOMBRE_PRODUCTO;
    }

    
   
}
