export class Requisicion {
  constructor(init) {
    // Identificación
    this.codigo = '';
    this.proyecto = '';
    this.lineaAccion = '';
    this.mandato = '';
    this.municipio = '';
    this.fechaSolicitud = '';
    this.lugarEntrega = '';
    this.fechaEntrega = '';
    this.solicitante = '';

    // Ítems
    this.items = [];

    // Justificación
    this.justificacion = '';
    this.recomendaciones = '';

    if (init) Object.assign(this, init);
  }

  validarIdentificacion() {
    if (!this.codigo || !this.proyecto || !this.lineaAccion || !this.municipio || !this.fechaSolicitud || !this.lugarEntrega || !this.fechaEntrega || !this.solicitante) {
      throw new Error('Todos los campos marcados con * son obligatorios en Identificación.');
    }
    if (new Date(this.fechaEntrega) < new Date(this.fechaSolicitud)) {
      throw new Error('La fecha de entrega debe ser igual o posterior a la fecha de solicitud.');
    }
    return true;
  }

  validarItems() {
    if (this.items.length === 0) {
      throw new Error('Debe agregar al menos un ítem a la requisición.');
    }
    const invalidItem = this.items.find(i => !i.detalle || !i.unidad || i.cantidad < 1 || i.precioUnitario < 0.01);
    if (invalidItem) {
      throw new Error('Todos los ítems deben tener detalle, unidad, cantidad >= 1 y precio >= 0.01.');
    }
    return true;
  }

  validarJustificacion() {
    if (!this.proyecto || !this.lineaAccion || !this.justificacion) {
      throw new Error('Los campos Proyecto, Línea de acción y Justificación son obligatorios.');
    }
    if (this.justificacion.length < 20) {
      throw new Error('La justificación debe tener al menos 20 caracteres.');
    }
    return true;
  }
}
