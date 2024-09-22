import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ProductForm from "../componets/ProductForm";
import { useProductForm } from "../hooks/useProductForm";
import { ConexionApiBackend } from "../services/ConexionApiBackend";
import { Product, Imagen } from "../modelos/productTypes";

const Home = () => {
  const {
    isEditing,
    selectedProduct,
    showModal,
    handleAddProduct,
    handleEditProduct,
    handleSubmit,
    handleCloseModal,
  } = useProductForm();

  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<{ [key: number]: string }>({}); // Almacena imágenes por imagenId

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await ConexionApiBackend.obtenerProductos();
        setProducts(fetchedProducts);

        // Obtener imágenes para cada producto
        const imagePromises = fetchedProducts.map(async (product: Product) => {
          if (product.imagenId) {
            const fetchedImage: Imagen =
              await ConexionApiBackend.obtenerImagenes(product.imagenId);
            return { id: product.imagenId, base64: fetchedImage.imagenBase64 };
          }
          return null;
        });

        const fetchedImages = await Promise.all(imagePromises);
        console.log(fetchedImages);

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
    try {
      await ConexionApiBackend.eliminarProducto(id);
      setProducts(products.filter((product) => product.idProducto !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container home-page">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          <img src="/logo.png" alt="Tekashi Shoes Logo" className="logo-img" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Help
              </a>
            </li>
          </ul>
        </div>
      </header>

      <div className="row mt-4">
        <div className="col-md-2">
          <ul className="list-group">
            <li className="list-group-item">Tenis</li>
            <li className="list-group-item">Zapatillas</li>
            <li className="list-group-item">Tacones</li>
            <li className="list-group-item">Botas</li>
            <li className="list-group-item">Mocasines</li>
          </ul>
        </div>

        <div className="col-md-7">
          <div className="featured-product">
            <img
              src="/img-1.png"
              alt="Featured"
              className="img-fluid featured-img"
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="news-card">
            <a href="https://www.adidas.co/">
              <img src="/img2.png" alt="Ad" className="img-fluid news-img" />
              <div className="news-info">
                <h3>Encuentra tu tenis perfecto</h3>
                <p>Buscador de Calzado</p>
                <button className="btn btn-outline-light btn-explore">
                  Explorar
                </button>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <button
            className="btn btn-primary w-100 mb-4"
            onClick={handleAddProduct}
          >
            Agregar más productos
          </button>

          {showModal && (
            <ProductForm
              isEditing={isEditing}
              selectedProduct={
                selectedProduct || {
                  idProducto: 0,
                  tipoProductoId: 0,
                  marca: "",
                  color: "",
                  precio: 0,
                  stock: 0,
                  imagenId: 0,
                }
              }
              onSubmit={async (product, base64Image) => {
                await handleSubmit(product, base64Image);
                const updatedProducts =
                  await ConexionApiBackend.obtenerProductos();
                setProducts(updatedProducts);
              }}
              onClose={handleCloseModal}
            />
          )}

          <div className="product-list">
            {products.map((product) => (
              <div
                key={product.idProducto}
                className="product-item d-flex justify-content-between align-items-center mb-3"
              >
                <div className="d-flex">
                  <img
                    src={
                      images[product.imagenId]
                        ? `${images[product.imagenId]}`
                        : "/path/to/error-image.png"
                    }
                    alt={product.marca}
                    className="img-fluid product-img"
                    onError={(e) => {
                      e.currentTarget.src = "/path/to/error-image.png";
                    }} // Carga una imagen de error si falla
                  />
                  <div className="ml-3">
                    <h5>{product.marca}</h5>
                    <p>US$ {product.precio}</p>
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteProduct(product.idProducto)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
