import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ProductForm from "../componets/ProductForm";
import { useProductForm } from "../hooks/useProductForm";

const Home = () => {
  const {
    isEditing,
    selectedProduct,
    showModal,
    handleAddProduct,
    handleEditProduct,
    handleSubmit,
    handleCloseModal,
    products,
    images,
    handleDeleteProduct,
    handleFilterByType,
  } = useProductForm();

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
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(1)} // ID para Tenis
            >
              Tenis
            </li>
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(2)} // ID para Zapatillas
            >
              Zapatillas
            </li>
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(3)} // ID para Tacones
            >
              Tacones
            </li>
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(4)} // ID para Botas
            >
              Botas
            </li>
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(5)} // ID para Mocasines
            >
              Mocasines
            </li>
            <li
              className="list-group-item"
              onClick={() => handleFilterByType(null)} // Mostrar todos
            >
              Mostrar Todos
            </li>
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
              }}
              onClose={handleCloseModal}
            />
          )}

          <div className="product-list">
            {products.length > 0 ? (
              products.map((product) => (
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
              ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
