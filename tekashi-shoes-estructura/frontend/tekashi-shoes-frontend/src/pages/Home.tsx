import logo from "../../public/logo.png";
import IMG1 from "../../public/img-1.png";
import IMG2 from "../../public/img2.png";
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
  } = useProductForm();

  return (
    <div className="container home-page">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Tekashi Shoes Logo" className="logo-img" />
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
            <img src={IMG1} alt="Featured" className="img-fluid featured-img" />
          </div>
        </div>

        <div className="col-md-3">
          <div className="news-card">
            <a href="https://www.adidas.co/">
              <img src={IMG2} alt="Ad" className="img-fluid news-img" />
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

          {/* Mostrar formulario como modal si showModal es true */}
          {showModal && (
            <ProductForm
              selectedProduct={
                selectedProduct || {
                  id_producto: 0,
                  tipo_producto: 0,
                  marca: "",
                  color: "",
                  precio: 0,
                  stock: 0,
                }
              }
              onSubmit={handleSubmit}
              isEditing={isEditing}
              onClose={handleCloseModal} // Permitir cerrar el modal
            />
          )}

          <div className="product-list">
            <div className="product-item d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex">
                <img
                  src="https://cdn.flightclub.com/750/TEMPLATE/343558/1.jpg"
                  alt="adidas Campus 2 KoRn Follow The Leader"
                  className="img-fluid product-img"
                />
                <div className="ml-3">
                  <h5>adidas Campus 2 KoRn Follow The Leader</h5>
                  <p>US$ 112</p>
                </div>
              </div>
              <div className="product-actions">
                <button
                  className="btn btn-edit"
                  onClick={() =>
                    handleEditProduct({
                      id_producto: 1,
                      tipo_producto: 1,
                      marca: "adidas",
                      color: "negro",
                      precio: 112,
                      stock: 5,
                    })
                  }
                >
                  <FaEdit />
                </button>
                <button className="btn btn-delete">
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            <div className="product-item d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex">
                <img
                  src="https://cdn.flightclub.com/750/TEMPLATE/346945/1.jpg"
                  alt="Jordan 4 Retro Military Blue (2024)"
                  className="img-fluid product-img"
                />
                <div className="ml-3">
                  <h5>Jordan 4 Retro Military Blue (2024)</h5>
                  <p>US$ 158</p>
                </div>
              </div>
              <div className="product-actions">
                <button
                  className="btn btn-edit"
                  onClick={() =>
                    handleEditProduct({
                      id_producto: 2,
                      tipo_producto: 2,
                      marca: "Jordan",
                      color: "azul",
                      precio: 158,
                      stock: 10,
                    })
                  }
                >
                  <FaEdit />
                </button>
                <button className="btn btn-delete">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
