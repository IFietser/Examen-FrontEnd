import React, { useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import "../css/Licitaciones.css";

// Componente reutilizable para exportar JSON
const ExportarJSON = ({ data }) => {
  const copiarJSON = () => {
    const texto = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(texto).then(() => {
      alert("JSON copiado al portapapeles.");
    });
  };

  const descargarJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "licitaciones.json";
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

const ITEMS_PER_PAGE = 10;

const Licitaciones = () => {
  const [licitaciones, setLicitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [urlConsulta, setUrlConsulta] = useState("");

  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [ticket, setTicket] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const estados = [
    { label: "Publicada - 5", value: "publicada" },
    { label: "Cerrada - 6", value: "cerrada" },
    { label: "Desierta - 7", value: "desierta" },
    { label: "Adjudicada - 8", value: "adjudicada" },
    { label: "Revocada - 15", value: "revocada" },
    { label: "Suspendida - 19", value: "suspendida" },
  ];

  const fetchLicitaciones = async (fechaStr, estadoStr, ticketStr) => {
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const formatearFecha = (fechaISO) => {
      const [yyyy, mm, dd] = fechaISO.split("-");
      return `${dd}${mm}${yyyy}`;
    };

    const fechaFormateada = formatearFecha(fechaStr);
    const estadoParam = estadoStr ? `&estado=${estadoStr}` : "";
    const ticketParam = ticketStr ? `&ticket=${ticketStr}` : "";

    const targetUrl = `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha=${fechaFormateada}${estadoParam}${ticketParam}`;

    setUrlConsulta(targetUrl);

    try {
      setLoading(true);
      setError(null);
      setLicitaciones([]);
      setCurrentPage(1);

      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const data = await response.json();

      if (data.Codigo === 10500) {
        throw new Error(data.Mensaje || "Error desconocido");
      }

      setLicitaciones(data.Listado || []);
      setHasSearched(true); // <-- Indicamos que ya se hizo la búsqueda
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    if (!fecha) {
      setError("Por favor selecciona una fecha");
      return;
    }
    if (!estado) {
      setError("Por favor selecciona un estado");
      return;
    }
    if (!ticket) {
      setError("Por favor ingresa el ticket");
      return;
    }
    setError(null);
    setHasSearched(false); // <-- Reiniciamos antes de hacer la búsqueda
    fetchLicitaciones(fecha, estado, ticket);
  };

  const totalPages = Math.ceil(licitaciones.length / ITEMS_PER_PAGE);
  const paginatedLicitaciones = licitaciones.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageGroupWithEllipsis = () => {
    const groupSize = 5;
    let start = currentPage - Math.floor(groupSize / 2);

    if (start < 2) start = 2;
    if (start + groupSize - 1 > totalPages - 1) {
      start = Math.max(totalPages - groupSize, 2);
    }

    const end = Math.min(start + groupSize - 1, totalPages - 1);
    const pages = [];

    if (totalPages === 0) return pages;

    pages.push(1);
    if (start > 2) {
      pages.push("start-ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("end-ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handleGoToPageChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && +value >= 1 && +value <= totalPages)
    ) {
      setGoToPage(value);
    }
  };

  const handleGoToPageKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGoToPage();
    }
  };

  const handleGoToPage = () => {
    const pageNumber = Number(goToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setGoToPage("");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Listado de licitaciones</h1>
      <Form>
        <Row className="mb-3 justify-content-center">
          <Col md={3} className="d-flex flex-column align-items-center">
            <Form.Group className="w-100 form-group-centered">
              <Form.Label className="text-center w-100">Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="text-center"
              />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center">
            <Form.Group className="w-100 form-group-centered">
              <Form.Label className="text-center w-100">Estado</Form.Label>
              <Form.Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="text-center select-centered"
              >
                <option value="">No seleccionado</option>
                {estados.map((est) => (
                  <option
                    key={est.value}
                    value={est.value}
                    className="text-center"
                  >
                    {est.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center">
            <Form.Group className="w-100 form-group-centered">
              <Form.Label className="text-center w-100">Ticket</Form.Label>
              <Form.Control
                type="text"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="Ingrese ticket"
                className="text-center"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12} className="d-flex justify-content-center gap-2">
            <Button onClick={handleBuscar} variant="primary">
              Buscar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setFecha("");
                setEstado("");
                setTicket("");
                setLicitaciones([]);
                setError(null);
                setCurrentPage(1);
                setUrlConsulta("");
                setHasSearched(false);
              }}
            >
              Limpiar filtros
            </Button>
          </Col>
        </Row>

        {urlConsulta && (
          <Alert variant="info" className="mb-4 text-center">
            <div>
              <strong>Endpoint consultado:</strong>
            </div>
            <code className="endpoint-code">{urlConsulta}</code>
          </Alert>
        )}
      </Form>

      {error && (
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Cargando licitaciones...</p>
        </div>
      )}

      {!loading && !error && licitaciones.length === 0 && (
        <Alert variant="info" className="text-center">
          {hasSearched
            ? "No se encontraron licitaciones."
            : "Favor realizar una búsqueda."}
        </Alert>
      )}

      {!loading && !error && paginatedLicitaciones.length > 0 && (
        <>
          <div className="text-center mb-3">
            <strong>
              Total de registros encontrados: {licitaciones.length}
            </strong>
          </div>

          {/* Botones Copiar/Descargar JSON */}
          <ExportarJSON data={licitaciones} />

          <table className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Codigo Externo</th>
                <th>Nombre</th>
                <th>Código Estado</th>
                <th>Fecha Cierre</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLicitaciones.map((licitacion) => (
                <tr key={licitacion.CodigoExterno}>
                  <td>{licitacion.CodigoExterno}</td>
                  <td>{licitacion.Nombre}</td>
                  <td>{licitacion.CodigoEstado}</td>
                  <td>
                    {new Date(licitacion.FechaCierre).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>

            {getPageGroupWithEllipsis().map((page, idx) => {
              if (page === "start-ellipsis" || page === "end-ellipsis") {
                return (
                  <span key={page + idx} className="px-2">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "light"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>

          <div className="d-flex justify-content-center align-items-center mb-4 mt-4">
            <Form
              className="d-flex align-items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Control
                type="text"
                min="1"
                max={totalPages}
                placeholder="Ir a página"
                value={goToPage}
                onChange={handleGoToPageChange}
                onKeyDown={handleGoToPageKeyDown}
                className="goto-page-input"
              />
              <Button variant="outline-primary" onClick={handleGoToPage}>
                Ir
              </Button>
            </Form>
          </div>
        </>
      )}
    </Container>
  );
};

export default Licitaciones;
