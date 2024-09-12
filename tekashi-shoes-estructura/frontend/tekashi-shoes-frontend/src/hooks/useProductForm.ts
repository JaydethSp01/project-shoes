import { useState } from "react";
import { Product } from "../modelos/productTypes";

export const useProductForm = () => {
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

  const handleSubmit = (product: Product) => {
    if (isEditing) {
      console.log("Editando producto: ", product);
    } else {
      console.log("Agregando producto: ", product);
    }
    setShowModal(false);
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
