import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaCode,
  FaRocket,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="row">
            <div className="col-md-4">
              <div className="footer-section">
                <h5>
                  <FaRocket className="me-2" />
                  Tekashi Shoes
                </h5>
                <p>
                  La mejor plataforma de e-commerce para calzado deportivo y
                  casual. Encuentra los zapatos perfectos para cada ocasión con
                  la mejor calidad y precios.
                </p>
                <div className="social-links mt-3">
                  <a href="#" className="me-3">
                    <FaGithub size={20} />
                  </a>
                  <a href="#" className="me-3">
                    <FaLinkedin size={20} />
                  </a>
                  <a href="#" className="me-3">
                    <FaTwitter size={20} />
                  </a>
                  <a href="#">
                    <FaInstagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>Productos</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">Tenis Deportivos</a>
                  </li>
                  <li>
                    <a href="#">Zapatillas</a>
                  </li>
                  <li>
                    <a href="#">Tacones</a>
                  </li>
                  <li>
                    <a href="#">Botas</a>
                  </li>
                  <li>
                    <a href="#">Mocasines</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>Empresa</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">Sobre Nosotros</a>
                  </li>
                  <li>
                    <a href="#">Nuestra Historia</a>
                  </li>
                  <li>
                    <a href="#">Carreras</a>
                  </li>
                  <li>
                    <a href="#">Prensa</a>
                  </li>
                  <li>
                    <a href="#">Contacto</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>Soporte</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">Centro de Ayuda</a>
                  </li>
                  <li>
                    <a href="#">Guía de Tallas</a>
                  </li>
                  <li>
                    <a href="#">Envíos</a>
                  </li>
                  <li>
                    <a href="#">Devoluciones</a>
                  </li>
                  <li>
                    <a href="#">Garantía</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>Legal</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">Términos de Uso</a>
                  </li>
                  <li>
                    <a href="#">Política de Privacidad</a>
                  </li>
                  <li>
                    <a href="#">Cookies</a>
                  </li>
                  <li>
                    <a href="#">Aviso Legal</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="developer-info">
            <div className="row">
              <div className="col-md-6">
                <h6>
                  <FaCode className="me-2" />
                  Desarrollado con ❤️ por
                </h6>
                <p>
                  <strong>David Santiago Sallas Pérez</strong>
                </p>
                <p>Ingeniero de Sistemas | Uniempresarial</p>
                <p>Desarrollador Full Stack Especializado</p>
                <p>React, Node.js, Java, MySQL, TypeScript</p>
              </div>
              <div className="col-md-6">
                <h6>
                  <FaRocket className="me-2" />
                  Tecnologías Utilizadas
                </h6>
                <p>Frontend: React 18, TypeScript, Vite, Bootstrap 5</p>
                <p>Backend: Java 17, Maven, HTTP Server</p>
                <p>Base de Datos: MySQL 8.0, JDBC</p>
                <p>Herramientas: Git, Maven, npm, Vite</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row">
              <div className="col-md-6">
                <p>© 2024 Tekashi Shoes. Todos los derechos reservados.</p>
              </div>
              <div className="col-md-6 text-end">
                <p>
                  Hecho con <FaHeart className="text-danger" /> en Colombia 🇨🇴
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
