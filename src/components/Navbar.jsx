import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import logo from "./Imagenes/LogoChile.png";
import "./css/Navbar.css";

function ColorSchemesExample() {
  return (
    <Navbar bg="outline-dark" data-bs-theme="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand
          className="titulo d-flex align-items-center gap-2"
          as={NavLink}
          to="/home"
        >
          <img src={logo} alt="Logo Chile" className="navbar-logo" />
          <span className="navbar-title">LicitaSeguros</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/home" end className="navbar-link">
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/licitaciones"
              end
              className="navbar-link"
            >
              Licitaciones
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/Proveedores"
              end
              className="navbar-link"
            >
              Proveedores
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/DetalleLicitaciones"
              end
              className="navbar-link"
            >
              Detalle Licitaciones
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
