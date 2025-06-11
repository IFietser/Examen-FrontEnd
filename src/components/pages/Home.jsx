import Region from "../Imagenes/Regiones.png";
import "../css/Home.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center my-4">
        <Col xs={12} className="text-center">
          <h1 className="home-subtitle">Bienvenido a LicitaSeguros</h1>
        </Col>
        {/* INFORMACION LICITASEGUROS */}
        <Row className="justify-content-center my-5">
          <Col md={8} sm={12}>
            <h2 className="info-title">¿Qué es LicitaSeguros?</h2>
            <p className="info-desc">
              <b>LicitaSeguros</b> es una plataforma que facilita la consulta y
              el acceso a información relevante sobre licitaciones públicas,
              proveedores y oportunidades de negocio en Chile. Nuestro objetivo
              es simplificar el proceso de búsqueda y análisis de licitaciones,
              permitiendo a empresas y personas encontrar oportunidades de
              manera rápida y eficiente.
            </p>
            <p className="info-desc">
              Aquí podrás explorar licitaciones activas, consultar detalles
              específicos, buscar proveedores y acceder a recursos útiles para
              participar en el mercado público. LicitaSeguros centraliza la
              información clave para que tomes mejores decisiones y aproveches
              al máximo las oportunidades disponibles.
            </p>
          </Col>
        </Row>
      </Row>
      <Row className="g-4 mt-2">
        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="home-card-title">Licitaciones</Card.Title>
              <Card.Text className="text-center">
                Consulta y explora las licitaciones públicas disponibles en el
                sistema.
              </Card.Text>
              <Button
                variant="outline-secondary"
                href="/licitaciones"
                className="mt-auto"
              >
                Ver Licitaciones
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="home-card-title">Proveedores</Card.Title>
              <Card.Text className="text-center">
                Busca información sobre proveedores registrados y su historial.
              </Card.Text>
              <Button
                variant="outline-secondary"
                href="/proveedores"
                className="mt-auto"
              >
                Ver Proveedores
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="home-card-title">
                Detalle Licitaciones
              </Card.Title>
              <Card.Text className="text-center">
                Consulta el detalle de una licitación específica ingresando su
                código.
              </Card.Text>
              <Button
                variant="outline-secondary"
                href="/detallelicitaciones"
                className="mt-auto"
              >
                Ver Detalle
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Col xs={12} className="text-center">
        <img src={Region} alt="img" className="home-img" />
      </Col>
      {/* Primera fila de 4 botones */}
      <h2 className="info-title text-center">Links Mercado Publico</h2>
      <Col xs={12}>
        <Row className="justify-content-center mb-2">
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://www.mercadopublico.cl/Portal/Modules/Site/Busquedas/BuscadorAvanzado.aspx?qs=2"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Órdenes de compra
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://buscador.mercadopublico.cl/compra-agil?date_from=2025-05-12&date_to=2025-06-11&order_by=recent&page_number=1&region=all&status=2"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Compra Ágil
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://www.mercadopublico.cl/Contratos/Ciudadania"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Contratos
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://consulta-mercado.mercadopublico.cl/buscador-publico?dateFrom=11-03-2025&dateTo=11-06-2025&order=100&page=1&status=100"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Consultas al mercado
            </Button>
          </Col>
        </Row>
      </Col>
      {/* Segunda fila de 4 botones */}
      <Col xs={12}>
        <Row className="justify-content-center mb-3">
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://www.mercadopublico.cl/Portal/Modules/Site/Busquedas/BuscadorAvanzado.aspx?qs=9"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Grandes compras
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://trato-directo.mercadopublico.cl/buscador-publico?dateFrom=04%2F06%2F2025&dateTo=11%2F06%2F2025&orderBy=1&page=0&size=10"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Trato directo
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://proveedor.mercadopublico.cl/busqueda"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Proveedores
            </Button>
          </Col>
          <Col xs={6} sm={3} md={3} className="mb-2 d-flex">
            <Button
              as="a"
              href="https://comprador.mercadopublico.cl/busqueda"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-secondary"
              size="sm"
              className="w-100 home-btn"
            >
              Compradores
            </Button>
          </Col>
        </Row>
      </Col>
    </Container>
  );
};

export default Home;
