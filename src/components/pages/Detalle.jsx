import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import React, { useState } from "react";
import "../css/Detalle.css";

const Detalle = () => {
  const [detalle, setDetalle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [urlConsulta, setUrlConsulta] = useState("");
  const [ticket, setTicket] = useState("");
  const [codigoexterno, setCodigoExterno] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [vista, setVista] = useState("tabla");
  const [mostrarDetalles, setMostrarDetalles] = useState({});

  const toggleSeccion = (index, seccion) => {
    setMostrarDetalles((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [seccion]: !prev[index]?.[seccion],
      },
    }));
  };

  const fetchDetalle = async () => {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const ticketParam = ticket ? `&ticket=${ticket}` : "";
    const codigoParam = codigoexterno ? `codigo=${codigoexterno}` : "";

    const targetUrl = `https://api.mercadopublico.cl/servicios/v1/Publico/Licitaciones.json?${codigoParam}${ticketParam}`;

    setUrlConsulta(targetUrl);
    try {
      setLoading(true);
      setError(null);
      setDetalle([]);
      setFechaCreacion(null);

      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const dataProxy = await response.json();
      const data = JSON.parse(dataProxy.contents);

      setDetalle(data.Listado || []);
      setFechaCreacion(data.FechaCreacion || null);
      setHasSearched(true);
      setVista("tarjeta"); // Fuerza la vista de tarjetas al buscar
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setTicket("");
    setCodigoExterno("");
    setDetalle([]);
    setError(null);
    setHasSearched(false);
    setUrlConsulta("");
    setFechaCreacion(null);
  };

  const copiarJSON = () => {
    const texto = JSON.stringify(detalle, null, 2);
    navigator.clipboard.writeText(texto).then(() => {
      alert("JSON copiado al portapapeles.");
    });
  };

  const descargarJSON = () => {
    const blob = new Blob([JSON.stringify(detalle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "licitaciones.json";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  const renderTablaObjeto = (obj) => (
    <table className="table table-bordered table-sm mt-2">
      <tbody>
        {Object.entries(obj).map(([key, val]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{val !== null ? val.toString() : "null"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center">Detalle de Licitación</h1>
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
                Código Externo Licitación
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese código externo"
                className="text-center"
                value={codigoexterno}
                onChange={(e) => setCodigoExterno(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12} className="d-flex justify-content-center gap-2">
            <Button variant="primary" onClick={fetchDetalle}>
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
          <p>Cargando Detalle de licitaciones...</p>
        </div>
      )}
      {!loading && !error && detalle.length === 0 && (
        <Alert variant="info" className="text-center">
          {hasSearched
            ? "No se encontraron proveedores."
            : "Favor realizar una búsqueda."}
        </Alert>
      )}
      {error && <p className="text-center text-danger mt-4">{error}</p>}
      {detalle.length > 0 && (
        <div className="mt-4">
          <div className="d-flex justify-content-center gap-2 mb-3">
            <Button variant="success" onClick={copiarJSON}>
              Copiar JSON
            </Button>
            <Button variant="info" onClick={descargarJSON}>
              Descargar JSON
            </Button>
          </div>

          {vista === "tabla" ? (
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {detalle.map((licitacion, index) => (
                  <tr key={index}>
                    <td>{licitacion.CodigoExterno}</td>
                    <td>{licitacion.Nombre}</td>
                    <td>{licitacion.Estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Row xs={1} md={1} lg={1} className="g-4">
              {detalle.map((licitacion, index) => (
                <Col key={index}>
                  <div className="card h-100 shadow border-secondary p-3">
                    <h6 className="text-primary mb-3">
                      Licitación #{index + 1}
                    </h6>
                    {/* Mostrar toda la información principal arriba de Comprador */}
                    <p>
                      <strong>Código:</strong> {licitacion.CodigoExterno}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {licitacion.Nombre}
                    </p>
                    <p>
                      <strong>Estado:</strong> {licitacion.Estado}
                    </p>
                    <p>
                      <strong>Código Estado:</strong> {licitacion.CodigoEstado}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {licitacion.Descripcion}
                    </p>
                    <p>
                      <strong>Fecha Cierre:</strong>{" "}
                      {licitacion.FechaCierre
                        ? new Date(licitacion.FechaCierre).toLocaleString()
                        : "No disponible"}
                    </p>

                    {/* Botón para mostrar/ocultar Comprador */}
                    {licitacion.Comprador && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleSeccion(index, "comprador")}
                          className="mb-2"
                        >
                          {mostrarDetalles[index]?.comprador
                            ? "Ocultar Comprador"
                            : "Mostrar Comprador"}
                        </Button>
                        {mostrarDetalles[index]?.comprador &&
                          renderTablaObjeto(licitacion.Comprador)}
                      </>
                    )}

                    {/* Información adicional entre Comprador y Fechas */}
                    <div className="mb-2">
                      <p>
                        <strong>Días Cierre Licitación:</strong>{" "}
                        {licitacion.DiasCierreLicitacion}
                      </p>
                      <p>
                        <strong>Informada:</strong> {licitacion.Informada}
                      </p>
                      <p>
                        <strong>Código Tipo:</strong> {licitacion.CodigoTipo}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {licitacion.Tipo}
                      </p>
                      <p>
                        <strong>Tipo Convocatoria:</strong>{" "}
                        {licitacion.TipoConvocatoria}
                      </p>
                      <p>
                        <strong>Moneda:</strong> {licitacion.Moneda}
                      </p>
                      <p>
                        <strong>Etapas:</strong> {licitacion.Etapas}
                      </p>
                      <p>
                        <strong>Estado Etapas:</strong>{" "}
                        {licitacion.EstadoEtapas}
                      </p>
                      <p>
                        <strong>Toma Razón:</strong> {licitacion.TomaRazon}
                      </p>
                      <p>
                        <strong>Estado Publicidad Ofertas:</strong>{" "}
                        {licitacion.EstadoPublicidadOfertas}
                      </p>
                      <p>
                        <strong>Justificación Publicidad:</strong>{" "}
                        {licitacion.JustificacionPublicidad}
                      </p>
                      <p>
                        <strong>Contrato:</strong> {licitacion.Contrato}
                      </p>
                      <p>
                        <strong>Obras:</strong> {licitacion.Obras}
                      </p>
                      <p>
                        <strong>Cantidad Reclamos:</strong>{" "}
                        {licitacion.CantidadReclamos}
                      </p>
                    </div>

                    {/* Botón para mostrar/ocultar Fechas */}
                    {licitacion.Fechas && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleSeccion(index, "fechas")}
                          className="mb-2 ms-2"
                        >
                          {mostrarDetalles[index]?.fechas
                            ? "Ocultar Fechas"
                            : "Mostrar Fechas"}
                        </Button>
                        {mostrarDetalles[index]?.fechas &&
                          renderTablaObjeto(licitacion.Fechas)}
                      </>
                    )}

                    {/* Botón para mostrar/ocultar Información del Contrato */}
                    <>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => toggleSeccion(index, "contrato")}
                        className="mb-2 ms-2"
                      >
                        {mostrarDetalles[index]?.contrato
                          ? "Ocultar Información del Contrato"
                          : "Mostrar Información del Contrato"}
                      </Button>

                      {mostrarDetalles[index]?.contrato &&
                        renderTablaObjeto({
                          "Unidad Tiempo Evaluación":
                            licitacion.UnidadTiempoEvaluacion,
                          "Dirección Visita":
                            licitacion.DireccionVisita || "No especificada",
                          "Dirección Entrega":
                            licitacion.DireccionEntrega || "No especificada",
                          Estimación: licitacion.Estimacion,
                          "Fuente Financiamiento":
                            licitacion.FuenteFinanciamiento,
                          "Visibilidad Monto": licitacion.VisibilidadMonto,
                          "Monto Estimado":
                            licitacion.MontoEstimado?.toLocaleString("es-CL") +
                            " CLP",
                          Tiempo: licitacion.Tiempo,
                          "Unidad Tiempo": licitacion.UnidadTiempo,
                          Modalidad: licitacion.Modalidad,
                          "Tipo Pago": licitacion.TipoPago,
                          "Nombre Responsable Pago":
                            licitacion.NombreResponsablePago,
                          "Email Responsable Pago":
                            licitacion.EmailResponsablePago ||
                            "No especificado",
                          "Nombre Responsable Contrato":
                            licitacion.NombreResponsableContrato,
                          "Email Responsable Contrato":
                            licitacion.EmailResponsableContrato ||
                            "No especificado",
                          "Fono Responsable Contrato":
                            licitacion.FonoResponsableContrato ||
                            "No especificado",
                          "Prohibición Contratación":
                            licitacion.ProhibicionContratacion,
                          SubContratación: licitacion.SubContratacion,
                          "Unidad Tiempo Duración Contrato":
                            licitacion.UnidadTiempoDuracionContrato,
                          "Tiempo Duración Contrato":
                            licitacion.TiempoDuracionContrato,
                          "Tipo Duración Contrato":
                            licitacion.TipoDuracionContrato ||
                            "No especificado",
                          "Justificación Monto Estimado":
                            licitacion.JustificacionMontoEstimado,
                          "Observación Contractual":
                            licitacion.ObservacionContract || "No especificada",
                          "Extensión Plazo": licitacion.ExtensionPlazo,
                          "¿Es Base Tipo?": licitacion.EsBaseTipo,
                          "Unidad Tiempo Contrato Licitación":
                            licitacion.UnidadTiempoContratoLicitacion,
                          "Valor Tiempo Renovación":
                            licitacion.ValorTiempoRenovacion,
                          "Periodo Tiempo Renovación":
                            licitacion.PeriodoTiempoRenovacion ||
                            "No especificado",
                          "¿Es Renovable?": licitacion.EsRenovable,
                        })}
                    </>
                    {/* Botón para mostrar/ocultar Adjudicación */}
                    {licitacion.Adjudicacion && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleSeccion(index, "adjudicacion")}
                          className="mb-2 ms-2"
                        >
                          {mostrarDetalles[index]?.adjudicacion
                            ? "Ocultar Adjudicación"
                            : "Mostrar Adjudicación"}
                        </Button>
                        {mostrarDetalles[index]?.adjudicacion &&
                          renderTablaObjeto(licitacion.Adjudicacion)}
                      </>
                    )}
                    {/* Botón para mostrar/ocultar Items */}
                    {licitacion.Items && licitacion.Items.Listado && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleSeccion(index, "items")}
                          className="mb-2 ms-2"
                        >
                          {mostrarDetalles[index]?.items
                            ? "Ocultar Items"
                            : "Mostrar Items"}
                        </Button>
                        {mostrarDetalles[index]?.items && (
                          <div className="mt-2">
                            <p>
                              <strong>Cantidad de Items:</strong>{" "}
                              {licitacion.Items.Cantidad}
                            </p>
                            {/* Botón para mostrar/ocultar Detalle de Items */}
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                toggleSeccion(index, "detalleItems")
                              }
                              className="mb-2 ms-2"
                            >
                              {mostrarDetalles[index]?.detalleItems
                                ? "Ocultar Detalle de Items"
                                : "Mostrar Detalle de Items"}
                            </Button>
                            {mostrarDetalles[index]?.detalleItems && (
                              <div style={{ overflowX: "auto" }}>
                                <table className="table table-bordered table-striped table-sm">
                                  <thead className="table-light">
                                    <tr>
                                      <th>#</th>
                                      <th>Código Producto</th>
                                      <th>Categoría</th>
                                      <th>Nombre Producto</th>
                                      <th>Descripción</th>
                                      <th>Unidad Medida</th>
                                      <th>Cantidad</th>
                                      <th>Proveedor</th>
                                      <th>Rut Proveedor</th>
                                      <th>Cant. Adjudicada</th>
                                      <th>Monto Unitario</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {licitacion.Items.Listado.map((item) => (
                                      <tr key={item.Correlativo}>
                                        <td>{item.Correlativo}</td>
                                        <td>{item.CodigoProducto}</td>
                                        <td>{item.Categoria}</td>
                                        <td>{item.NombreProducto}</td>
                                        <td>{item.Descripcion}</td>
                                        <td>{item.UnidadMedida}</td>
                                        <td>{item.Cantidad}</td>
                                        <td>
                                          {item.Adjudicacion?.NombreProveedor}
                                        </td>
                                        <td>
                                          {item.Adjudicacion?.RutProveedor}
                                        </td>
                                        <td>{item.Adjudicacion?.Cantidad}</td>
                                        <td>
                                          {item.Adjudicacion?.MontoUnitario
                                            ? item.Adjudicacion.MontoUnitario.toLocaleString(
                                                "es-CL"
                                              )
                                            : ""}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </Container>
  );
};

export default Detalle;
