import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import React, { useState } from "react";
import "../css/Proveedores.css";

// Componente reutilizable para exportar JSON
const ExportarJSON = ({ data }) => {
  const copiarJSON = () => {
    const texto = JSON.stringify(
      data.map((empresa) => ({
        CodigoEmpresa: empresa.CodigoEmpresa,
        NombreEmpresa: empresa.NombreEmpresa,
      })),
      null,
      2
    );
    navigator.clipboard.writeText(texto).then(() => {
      alert("JSON copiado al portapapeles.");
    });
  };

  const descargarJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          data.map((empresa) => ({
            CodigoEmpresa: empresa.CodigoEmpresa,
            NombreEmpresa: empresa.NombreEmpresa,
          })),
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "proveedores.json";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex justify-content-center gap-2 mb-3">
      <Button variant="success" onClick={copiarJSON}>
        Copiar JSON
      </Button>
      <Button variant="info" onClick={descargarJSON}>
        Descargar JSON
      </Button>
    </div>
  );
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [urlConsulta, setUrlConsulta] = useState("");
  const [ticket, setTicket] = useState("");
  const [rut, setRut] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState(null);

  const fetchProveedores = async () => {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const ticketParam = ticket ? `&ticket=${ticket}` : "";
    const rutParam = rut ? `rutempresaproveedor=${rut}` : "";

    const targetUrl = `https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?${rutParam}${ticketParam}`;

    setUrlConsulta(targetUrl);
    try {
      setLoading(true);
      setError(null);
      setProveedores([]);
      setFechaCreacion(null);

      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const dataProxy = await response.json();
      const data = JSON.parse(dataProxy.contents);

      setProveedores(data.listaEmpresas || []);
      setFechaCreacion(data.FechaCreacion || null);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setTicket("");
    setRut("");
    setProveedores([]);
    setError(null);
    setHasSearched(false);
    setUrlConsulta("");
    setFechaCreacion(null);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Listado de Proveedores</h1>
      <Form>
        <Row className="mb-3 justify-content-center">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-center w-100">Ticket</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese ticket"
                className="text-center"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-center w-100">
                RUT Empresa Proveedor
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese RUT"
                className="text-center"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12} className="d-flex justify-content-center gap-2">
            <Button variant="primary" onClick={fetchProveedores}>
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleLimpiar}>
              Limpiar filtros
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Mostrar URL consultada */}
      {urlConsulta && (
        <Alert variant="info" className="mb-4 text-center">
          <div>
            <strong>Endpoint consultado:</strong>
          </div>
          <code className="endpoint-code">{urlConsulta}</code>
        </Alert>
      )}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Cargando Proveedores...</p>
        </div>
      )}

      {!loading && !error && proveedores.length === 0 && (
        <Alert variant="info" className="text-center">
          {hasSearched
            ? "No se encontraron proveedores."
            : "Favor realizar una búsqueda."}
        </Alert>
      )}

      {proveedores.length > 0 && (
        <div className="mt-4">
          {/* Botones Copiar/Descargar JSON */}
          <ExportarJSON data={proveedores} />

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Código Empresa</th>
                <th>Nombre Empresa</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((empresa, index) => (
                <tr key={index}>
                  <td>{empresa.CodigoEmpresa}</td>
                  <td>{empresa.NombreEmpresa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
};

export default Proveedores;
