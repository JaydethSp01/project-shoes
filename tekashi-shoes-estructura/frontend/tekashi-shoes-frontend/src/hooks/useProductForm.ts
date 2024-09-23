import { useState, useEffect } from "react";
import { Product, Imagen } from "../modelos/productTypes";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useProductForm = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await ConexionApiBackend.obtenerProductos();
        setProducts(fetchedProducts);
        setAllProducts(fetchedProducts);

        const imagePromises = fetchedProducts.map(async (product: Product) => {
          if (product.imagenId) {
            const fetchedImage: Imagen =
              await ConexionApiBackend.obtenerImagenes(product.imagenId);
            return { id: product.imagenId, base64: fetchedImage.imagenBase64 };
          }
          return null;
        });

        const fetchedImages = await Promise.all(imagePromises);
        const imageMap = fetchedImages.reduce((acc, img) => {
          if (img) {
            acc[img.id] = img.base64;
          }
          return acc;
        }, {} as { [key: number]: string });

        setImages(imageMap);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await ConexionApiBackend.eliminarProducto(id);
        setProducts(products.filter((product) => product.idProducto !== id));
        setAllProducts(
          allProducts.filter((product) => product.idProducto !== id)
        );
        await Swal.fire({
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        await Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el producto.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const validateProduct = (product: Product, base64Image: string): boolean => {
    if (
      !product ||
      Object.values(product).every((value) => value === "" || value === 0)
    ) {
      Swal.fire("Error", "No se puede enviar el formulario vacío.", "error");
      return false;
    }
    if (!product.tipoProductoId) {
      Swal.fire("Error", "El tipo de producto es obligatorio.", "error");
      return false;
    }
    if (!product.marca.trim()) {
      Swal.fire("Error", "La marca es obligatoria.", "error");
      return false;
    }
    if (!product.color.trim()) {
      Swal.fire("Error", "El color es obligatorio.", "error");
      return false;
    }
    if (product.precio <= 0) {
      Swal.fire("Error", "El precio debe ser mayor que 0.", "error");
      return false;
    }
    if (product.stock <= 0) {
      Swal.fire(
        "Error",
        "El stock no puede ser negativo o igual a cero.",
        "error"
      );
      return false;
    }
    if (!base64Image && isEditing == false) {
      Swal.fire("Error", "Se debe subir una imagen.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (product: Product, base64Image: string) => {
    if (!validateProduct(product, base64Image)) {
      return;
    }

    let imagenId = null;

    if (base64Image) {
      imagenId = await ConexionApiBackend.agregarImagen({
        imagenBase64: base64Image,
      });
      product.imagenId = imagenId;
    }

    if (isEditing) {
      await ConexionApiBackend.actualizarProducto(product.idProducto, product);
      const result = await Swal.fire({
        title: "¡Actualización exitosa!",
        text: "El producto ha sido actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      if (result.isConfirmed) {
        setShowModal(false);
        navigate("/");
        window.location.reload();
      }
    } else {
      await ConexionApiBackend.agregarProducto(product);
      const result = await Swal.fire({
        title: "¡Éxito!",
        text: "El producto ha sido agregado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

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

  const handleFilterByType = (tipoId: number | null) => {
    if (tipoId !== null) {
      const filteredProducts = allProducts.filter(
        (product) => product.tipoProductoId === tipoId
      );
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts);
    }
    setSelectedTypeId(tipoId);
  };

  return {
    isEditing,
    selectedProduct,
    showModal,
    products,
    images,
    handleAddProduct,
    handleEditProduct,
    handleSubmit,
    handleDeleteProduct,
    handleCloseModal,
    handleFilterByType,
  };
};
