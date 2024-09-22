import { useState } from "react";
import { Product } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useProductForm = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSubmit = async (product: Product, base64Image: string) => {
    let imagenId = null;

    // Primero, agrega la imagen si existe
    if (base64Image) {
      imagenId = await ConexionApiBackend.agregarImagen({
        imagenBase64: base64Image,
      });
      console.log("ID de la imagen insertada:", imagenId);

      // Asigna el ID de la imagen al producto
      product.imagenId = imagenId;
    }

    // Elimina idProducto si existe antes de enviar
    const { idProducto, ...productData } = product;

    console.log("Objeto de producto a enviar:", productData);

    if (isEditing) {
      // Actualizar producto
      await ConexionApiBackend.actualizarProducto(product.idProducto, product);

      // SweetAlert para actualización
      const result = await Swal.fire({
        title: "¡Actualización exitosa!",
        text: "El producto ha sido actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      // Redirige solo si el usuario hace clic en "Aceptar"
      if (result.isConfirmed) {
        setShowModal(false);
        navigate("/"); // Redirige a la página principal
        window.location.reload();
      }
    } else {
      await ConexionApiBackend.agregarProducto(product);

      // SweetAlert para agregar
      const result = await Swal.fire({
        title: "¡Éxito!",
        text: "El producto ha sido agregado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      // Redirige solo si el usuario hace clic en "Aceptar"
      if (result.isConfirmed) {
        setShowModal(false);
        navigate("/");
        window.location.reload();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return {
    isEditing,
    selectedProduct,
    showModal,
    handleAddProduct,
    handleEditProduct,
    handleSubmit,
    handleCloseModal,
  };
};
