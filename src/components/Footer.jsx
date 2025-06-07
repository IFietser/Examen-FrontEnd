import Logo from "./Imagenes/LogoChile.png";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={3} className="mb-3">
            <img
              src={Logo}
              alt=""
              style={{ width: "150px", marginBottom: "10px" }}
              className="img-fluid"
            />
            <div>
              <strong>Dirección ChileCompras</strong>
              <br />
              Ministerio de Hacienda, Gobierno de Chile
              <br />
              Monjitas 392 - Piso 8, Santiago de Chile
              <br />
              <a
                href="https://www.chilecompra.cl/terminos-y-condiciones-de-uso/"
                className="text-light text-decoration-underline"
              >
                Términos y condiciones
              </a>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Sitios relacionados</strong>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://comprador.mercadopublico.cl/registrarme"
                  className="text-light text-decoration-underline"
                >
                  Registro nuevos organismos compradores
                </a>
              </li>
              <li>
                <a
                  href="https://datos-abiertos.chilecompra.cl/"
                  className="text-light text-decoration-underline"
                >
                  Datos Abiertos ChileCompra
                </a>
              </li>
              <li>
                <a
                  href="https://capacitacion.chilecompra.cl/"
                  className="text-light text-decoration-underline"
                >
                  Capacitación
                </a>
              </li>
              <li>
                <a
                  href="https://ayuda.mercadopublico.cl/"
                  className="text-light text-decoration-underline"
                >
                  Centro de Ayuda
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Mesa de ayuda</strong>
            <div>
              <a
                href="tel:6007000600"
                className="text-light text-decoration-underline"
              >
                600 7000 600
              </a>
              <br />
              <a
                href="tel:+56442360646"
                className="text-light text-decoration-underline"
              >
                +56 4 4236 0646
              </a>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <strong>Síguenos</strong>
            <div className="mb-2">
              <a
                href="https://web.facebook.com/people/ChileCompra/100064656435287/?_rdc=1&_rdr#"
                className="text-light me-2"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://x.com/chilecompra" className="text-light me-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="linkedin.com/company/chilecompra?originalSubdomain=cl"
                className="text-light me-2"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://www.youtube.com/user/chilecompratv"
                className="text-light me-2"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://www.instagram.com/chilecompra/"
                className="text-light"
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
