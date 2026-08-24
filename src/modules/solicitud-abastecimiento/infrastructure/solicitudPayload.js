function normalizeProyectos(proyectos) {
  if (!Array.isArray(proyectos)) {
    return [];
  }

  return proyectos.map((proyecto) => ({
    id: proyecto.id,
    planAbastecimientoId: proyecto.planAbastecimientoId,
    planAbastecimiento: proyecto.planAbastecimiento,
    itemId: proyecto.itemId,
    item: proyecto.item,
    porcentaje: proyecto.porcentaje,
    presupuestoAsignado: proyecto.presupuestoAsignado || 0,
    presupuestoDisponibleRubro: proyecto.presupuestoDisponibleRubro || 0,
    productosServicios: Array.isArray(proyecto.productosServicios)
      ? proyecto.productosServicios.map((producto) => ({
          id: producto.id,
          descripcion: producto.descripcion,
          cantidad: producto.cantidad,
          unidadMedida: producto.unidadMedida,
          valorUnitario: producto.valorUnitario,
          fechaInicio: producto.fechaInicio || null,
          fechaFin: producto.fechaFin || null,
        }))
      : [],
  }));
}

export function toSolicitudPayload(solicitud, { includeId = false } = {}) {
  const source =
    solicitud && typeof solicitud === "object"
      ? JSON.parse(JSON.stringify(solicitud))
      : {};

  const payload = {
    nombreOrden: (source.nombreOrden || "").trim(),
    subdireccion: source.subdireccion || "",
    descripcionNecesidad: source.descripcionNecesidad || "",
    proyectos: normalizeProyectos(source.proyectos),
    presupuestoDisponible: source.presupuestoDisponible || 0,
    nivelAprobacion: source.nivelAprobacion || "",
    observacionesProductos: source.observacionesProductos || "",
    departamento: source.departamento || "",
    municipio: source.municipio || "",
    direccion: source.direccion || "",
    contacto: source.contacto || "",
    telefono: source.telefono || "",
    fechaEntrega: source.fechaEntrega || "",
    requiereFlete: source.requiereFlete || false,
    garantias: source.garantias || "",
    departamentoId: source.departamentoId || null,
    departamentoNombre: source.departamentoNombre || "",
    areaNombre: source.areaNombre || "",
  };

  if (includeId && source.id) {
    payload.id = source.id;
  }

  if (source.estado) {
    payload.estado = source.estado;
  }

  if (Array.isArray(source.encargados)) {
    payload.encargados = source.encargados;
  }

  return payload;
}
