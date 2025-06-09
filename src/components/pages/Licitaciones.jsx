import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ITEMS_PER_PAGE = 10;

const Licitaciones = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [goToPage, setGoToPage] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json.Listado || []));
  }, []);

  const getPageGroupWithEllipsis = () => {
    const groupSize = 5;
    let start = currentPage - Math.floor(groupSize / 2);

    if (start < 2) start = 2; // Siempre mostramos el 1 al inicio
    if (start + groupSize - 1 > totalPages - 1) {
      start = Math.max(totalPages - groupSize, 2);
    }

    const end = Math.min(start + groupSize - 1, totalPages - 1);

    const pages = [];

    pages.push(1); // Siempre mostrar la primera página

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
      pages.push(totalPages); // Siempre mostrar la última página
    }

    return pages;
  };

  // Filtrar datos según estado y fechas
  const filtrar = () => {
    let resultados = data.filter((item) => {
      const fecha = new Date(item.FechaCierre);
      const fechaStr = fecha.toISOString().split("T")[0];
      const desdeStr = fechaDesde || null;
      const hastaStr = fechaHasta || null;

      return (
        (estado ? item.CodigoEstado === parseInt(estado) : true) &&
        (desdeStr ? fechaStr >= desdeStr : true) &&
        (hastaStr ? fechaStr <= hastaStr : true)
      );
    });

    // Ordenar siempre por fecha
    resultados.sort((a, b) => {
      const fechaA = new Date(a.FechaCierre);
      const fechaB = new Date(b.FechaCierre);
      return fechaA - fechaB;
    });

    return resultados;
  };

  const filteredData = filtrar();

  // Paginación
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers para filtros (reinician la página)
  const onChangeEstado = (e) => {
    setEstado(e.target.value);
    setCurrentPage(1);
  };
  const onChangeFechaDesde = (e) => {
    setFechaDesde(e.target.value);
    setCurrentPage(1);
  };
  const onChangeFechaHasta = (e) => {
    setFechaHasta(e.target.value);
    setCurrentPage(1);
  };

  const handleGoToPageChange = (e) => {
    // Solo números o vacío
    if (/^\d*$/.test(e.target.value)) {
      setGoToPage(e.target.value);
    }
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setGoToPage("");
  };

  const handleGoToPageKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita que se envíe el formulario si está en un <form>
      handleGoToPage();
    }
  };

  // Abrir modal con detalle
  const handleVerDetalle = (licitacion) => {
    setDetalleSeleccionado(licitacion);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setShowModal(false);
    setDetalleSeleccionado(null);
  };

  const handleLimpiarFiltros = () => {
    setEstado("");
    setFechaDesde("");
    setFechaHasta("");
    /*setCurrentPage(1);*/
  };

  return (
    <Container>
      <h2 className="mt-4 mb-4">Listado de las licitaciones</h2>

      {/* Filtros */}
      <Form className="mb-4">
        <Form.Group controlId="estado" className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            inputMode="numeric" // Teclado numérico en móviles
            pattern="[0-9]*"
            placeholder="Código de estado"
            value={estado}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setEstado(value);
                setCurrentPage(1);
              }
            }}
          />
        </Form.Group>

        <Form.Group controlId="fechaDesde" className="mb-3">
          <Form.Label>Fecha Desde</Form.Label>
          <Form.Control
            type="date"
            value={fechaDesde}
            onChange={onChangeFechaDesde}
          />
        </Form.Group>
        <Form.Group controlId="fechaHasta" className="mb-3">
          <Form.Label>Fecha Hasta</Form.Label>
          <Form.Control
            type="date"
            value={fechaHasta}
            onChange={onChangeFechaHasta}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleLimpiarFiltros}>
          Limpiar filtros
        </Button>
      </Form>

      {/* Tabla */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha Cierre</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((licitacion, idx) => (
            <tr key={idx}>
              <td>{licitacion.CodigoExterno}</td>
              <td>{new Date(licitacion.FechaCierre).toLocaleString()}</td>
              <td>{licitacion.CodigoEstado}</td> {/* Nuevo dato */}
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleVerDetalle(licitacion)}
                >
                  Ver
                </Button>
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">
                No hay resultados que mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      <div className="d-flex justify-content-center align-items-center mb-4 gap-2 flex-wrap">
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

      {/* 🔍 Input para ir a página */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <Form className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            min="1"
            max={totalPages}
            placeholder="Ir a página"
            value={goToPage}
            onChange={handleGoToPageChange} // Este handler ya no funcionará igual
            onKeyDown={handleGoToPageKeyDown}
            style={{ width: "100px" }}
          />
          <Button variant="outline-primary" onClick={handleGoToPage}>
            Ir
          </Button>
        </Form>
      </div>

      {/* Modal de detalle */}
      <Modal show={showModal} onHide={handleCerrarModal} centered>
        <Modal.Header>
          <Modal.Title>Detalles Licitación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleSeleccionado ? (
            <>
              <p>
                <strong>Código Externo:</strong>{" "}
                {detalleSeleccionado.CodigoExterno}
              </p>
              <p>
                <strong>Nombre:</strong> {detalleSeleccionado.Nombre}
              </p>
              <p>
                <strong>Estado:</strong> {detalleSeleccionado.CodigoEstado}
              </p>
              <p>
                <strong>Fecha Cierre:</strong>{" "}
                {new Date(detalleSeleccionado.FechaCierre).toLocaleString()}
              </p>
              {/* Agrega más detalles aquí si quieres */}
            </>
          ) : (
            <p>Cargando detalle...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleCerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Licitaciones;
