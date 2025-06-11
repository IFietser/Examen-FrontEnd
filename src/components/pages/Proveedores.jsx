import { Container, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState } from "react";

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
                style={{ textAlign: "center" }}
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
                style={{ textAlign: "center" }}
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

      {loading && <p className="text-center mt-4">Cargando...</p>}

      {error && <p className="text-center text-danger mt-4">{error}</p>}

      {hasSearched && proveedores.length === 0 && !loading && (
        <p className="text-center mt-4">No se encontraron proveedores.</p>
      )}

      {proveedores.length > 0 && (
        <div className="mt-4">
          <h5 className="text-center mb-3">Resultados:</h5>
          {fechaCreacion && (
            <p className="text-center text-muted">
              Fecha de consulta: {new Date(fechaCreacion).toLocaleString()}
            </p>
          )}
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

      {/* Mostrar URL consultada */}
      {hasSearched && urlConsulta && (
        <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#555" }}>
          <p>
            <b>URL consultada:</b> {urlConsulta}
          </p>
        </div>
      )}

      {/* Mostrar datos crudos o mensaje */}
      {hasSearched && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#eee",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {JSON.stringify(
            proveedores.length > 0 ? proveedores : "No hay proveedores",
            null,
            2
          )}
        </pre>
      )}
    </Container>
  );
};

export default Proveedores;
