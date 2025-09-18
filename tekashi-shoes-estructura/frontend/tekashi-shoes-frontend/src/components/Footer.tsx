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
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="row">
            <div className="col-md-4">
              <div className="footer-section">
                <h5>
                  <FaRocket className="me-2" />
                  {t("header.brandName")}
                </h5>
                <p>{t("additional.footer.description")}</p>
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
                <h5>{t("additional.footer.products")}</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">{t("additional.footer.sportsSneakers")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.sneakers")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.heels")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.boots")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.loafers")}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>{t("additional.footer.company")}</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">{t("additional.footer.aboutUs")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.ourHistory")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.careers")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.press")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.contact")}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>{t("additional.footer.support")}</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">{t("additional.footer.helpCenter")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.sizeGuide")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.shipping")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.returns")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.warranty")}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <div className="footer-section">
                <h5>{t("additional.footer.legal")}</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">{t("additional.footer.termsOfUse")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.privacyPolicy")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.cookies")}</a>
                  </li>
                  <li>
                    <a href="#">{t("additional.footer.legalNotice")}</a>
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
                  {t("additional.footer.developedWith")}
                </h6>
                <p>
                  <strong>{t("additional.footer.developerName")}</strong>
                </p>
                <p>{t("additional.footer.developerTitle")}</p>
                <p>{t("additional.footer.developerSpecialty")}</p>
                <p>{t("additional.footer.developerSkills")}</p>
              </div>
              <div className="col-md-6">
                <h6>
                  <FaRocket className="me-2" />
                  {t("additional.footer.technologiesUsed")}
                </h6>
                <p>{t("additional.footer.frontend")}</p>
                <p>{t("additional.footer.backend")}</p>
                <p>{t("additional.footer.database")}</p>
                <p>{t("additional.footer.tools")}</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row">
              <div className="col-md-6">
                <p>{t("copyright")}</p>
              </div>
              <div className="col-md-6 text-end">
                <p>
                  {t("additional.footer.madeIn")}{" "}
                  <FaHeart className="text-danger" />
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
