import Logo from "./Imagenes/LogoChile.png";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-navbar-style py-4 mt-auto">
      <Container>
        <Row>
          <Col md={3} className="mb-3 d-flex flex-column align-items-start">
            <img src={Logo} alt="Logo Chile" className="footer-logo mb-2" />
            <div>
              <strong>Dirección LicitaSeguros </strong>
              <br />
              Ministerio de Hacienda, Gobierno de Chile
              <br />
              Av. Innovación 1234, Oficina 801, Santiago Centro
              <br />
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Sitios relacionados</strong>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://comprador.mercadopublico.cl/registrarme"
                  className="footer-link"
                >
                  Registro nuevos organismos compradores
                </a>
              </li>
              <li>
                <a
                  href="https://datos-abiertos.chilecompra.cl/"
                  className="footer-link"
                >
                  Datos Abiertos ChileCompra
                </a>
              </li>
              <li>
                <a
                  href="https://capacitacion.chilecompra.cl/"
                  className="footer-link"
                >
                  Capacitación
                </a>
              </li>
              <li>
                <a
                  href="https://ayuda.mercadopublico.cl/"
                  className="footer-link"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="https://www.chilecompra.cl/terminos-y-condiciones-de-uso/"
                  className="footer-link"
                >
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Mesa de ayuda</strong>
            <div>
              <a href="tel:6007000600" className="footer-link">
                600 7000 600
              </a>
              <br />
              <a href="tel:+56442360646" className="footer-link">
                +56 4 4236 0646
              </a>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Síguenos</strong>
            <div className="mb-2">
              <a
                href="https://web.facebook.com/people/ChileCompra/100064656435287/?_rdc=1&_rdr#"
                className="footer-link me-2"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://x.com/chilecompra" className="footer-link me-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://linkedin.com/company/chilecompra?originalSubdomain=cl"
                className="footer-link me-2"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://www.youtube.com/user/chilecompratv"
                className="footer-link me-2"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://www.instagram.com/chilecompra/"
                className="footer-link"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
            <div>(6N)</div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
