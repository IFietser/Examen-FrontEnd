import { Container, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState } from "react";

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
                style={{ textAlign: "center" }}
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
                style={{ textAlign: "center" }}
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

      {loading && <p className="text-center mt-4">Cargando...</p>}
      {error && <p className="text-center text-danger mt-4">{error}</p>}
      {hasSearched && detalle.length === 0 && !loading && (
        <p className="text-center mt-4">No se encontraron resultados.</p>
      )}

      {detalle.length > 0 && (
        <div className="mt-4">
          <h5 className="text-center mb-3">Resultados:</h5>
          {fechaCreacion && (
            <p className="text-center text-muted">
              Fecha de consulta: {new Date(fechaCreacion).toLocaleString()}
            </p>
          )}

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

                      {mostrarDetalles[index]?.contrato && (
                        <div className="mt-2">
                          <p>
                            <strong>Unidad Tiempo Evaluación:</strong>{" "}
                            {licitacion.UnidadTiempoEvaluacion}
                          </p>
                          <p>
                            <strong>Dirección Visita:</strong>{" "}
                            {licitacion.DireccionVisita || "No especificada"}
                          </p>
                          <p>
                            <strong>Dirección Entrega:</strong>{" "}
                            {licitacion.DireccionEntrega || "No especificada"}
                          </p>
                          <p>
                            <strong>Estimación:</strong> {licitacion.Estimacion}
                          </p>
                          <p>
                            <strong>Fuente Financiamiento:</strong>{" "}
                            {licitacion.FuenteFinanciamiento}
                          </p>
                          <p>
                            <strong>Visibilidad Monto:</strong>{" "}
                            {licitacion.VisibilidadMonto}
                          </p>
                          <p>
                            <strong>Monto Estimado:</strong>{" "}
                            {licitacion.MontoEstimado?.toLocaleString("es-CL")}{" "}
                            CLP
                          </p>
                          <p>
                            <strong>Tiempo:</strong> {licitacion.Tiempo}
                          </p>
                          <p>
                            <strong>Unidad Tiempo:</strong>{" "}
                            {licitacion.UnidadTiempo}
                          </p>
                          <p>
                            <strong>Modalidad:</strong> {licitacion.Modalidad}
                          </p>
                          <p>
                            <strong>Tipo Pago:</strong> {licitacion.TipoPago}
                          </p>
                          <p>
                            <strong>Nombre Responsable Pago:</strong>{" "}
                            {licitacion.NombreResponsablePago}
                          </p>
                          <p>
                            <strong>Email Responsable Pago:</strong>{" "}
                            {licitacion.EmailResponsablePago ||
                              "No especificado"}
                          </p>
                          <p>
                            <strong>Nombre Responsable Contrato:</strong>{" "}
                            {licitacion.NombreResponsableContrato}
                          </p>
                          <p>
                            <strong>Email Responsable Contrato:</strong>{" "}
                            {licitacion.EmailResponsableContrato ||
                              "No especificado"}
                          </p>
                          <p>
                            <strong>Fono Responsable Contrato:</strong>{" "}
                            {licitacion.FonoResponsableContrato ||
                              "No especificado"}
                          </p>
                          <p>
                            <strong>Prohibición Contratación:</strong>{" "}
                            {licitacion.ProhibicionContratacion}
                          </p>
                          <p>
                            <strong>SubContratación:</strong>{" "}
                            {licitacion.SubContratacion}
                          </p>
                          <p>
                            <strong>Unidad Tiempo Duración Contrato:</strong>{" "}
                            {licitacion.UnidadTiempoDuracionContrato}
                          </p>
                          <p>
                            <strong>Tiempo Duración Contrato:</strong>{" "}
                            {licitacion.TiempoDuracionContrato}
                          </p>
                          <p>
                            <strong>Tipo Duración Contrato:</strong>{" "}
                            {licitacion.TipoDuracionContrato ||
                              "No especificado"}
                          </p>
                          <p>
                            <strong>Justificación Monto Estimado:</strong>{" "}
                            {licitacion.JustificacionMontoEstimado}
                          </p>
                          <p>
                            <strong>Observación Contractual:</strong>{" "}
                            {licitacion.ObservacionContract ||
                              "No especificada"}
                          </p>
                          <p>
                            <strong>Extensión Plazo:</strong>{" "}
                            {licitacion.ExtensionPlazo}
                          </p>
                          <p>
                            <strong>¿Es Base Tipo?:</strong>{" "}
                            {licitacion.EsBaseTipo}
                          </p>
                          <p>
                            <strong>Unidad Tiempo Contrato Licitación:</strong>{" "}
                            {licitacion.UnidadTiempoContratoLicitacion}
                          </p>
                          <p>
                            <strong>Valor Tiempo Renovación:</strong>{" "}
                            {licitacion.ValorTiempoRenovacion}
                          </p>
                          <p>
                            <strong>Periodo Tiempo Renovación:</strong>{" "}
                            {licitacion.PeriodoTiempoRenovacion ||
                              "No especificado"}
                          </p>
                          <p>
                            <strong>¿Es Renovable?:</strong>{" "}
                            {licitacion.EsRenovable}
                          </p>
                        </div>
                      )}
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
                        {mostrarDetalles[index]?.adjudicacion && (
                          <div className="mt-2">
                            <table className="table table-bordered table-sm">
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Tipo</strong>
                                  </td>
                                  <td>{licitacion.Adjudicacion.Tipo}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Fecha</strong>
                                  </td>
                                  <td>
                                    {licitacion.Adjudicacion.Fecha
                                      ? new Date(
                                          licitacion.Adjudicacion.Fecha
                                        ).toLocaleString()
                                      : "No especificada"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Número</strong>
                                  </td>
                                  <td>{licitacion.Adjudicacion.Numero}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Número Oferentes</strong>
                                  </td>
                                  <td>
                                    {licitacion.Adjudicacion.NumeroOferentes}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>URL Acta</strong>
                                  </td>
                                  <td>
                                    {licitacion.Adjudicacion.UrlActa ? (
                                      <a
                                        href={licitacion.Adjudicacion.UrlActa}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Ver Acta
                                      </a>
                                    ) : (
                                      "No disponible"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
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
                              variant="outline-primary"
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
