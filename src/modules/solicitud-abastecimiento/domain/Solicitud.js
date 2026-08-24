/**
 * Domain Objects for Solicitud Abastecimiento
 */

export class SolicitudAbastecimiento {
  constructor(init) {
    // 1. Datos de la solicitud
    this.nombreOrden = '';
    this.subdireccion = '';
    this.descripcionNecesidad = '';

    // 2. Datos financieros
    this.proyectos = [];
    this.presupuestoDisponible = 0;
    this.nivelAprobacion = '';

    // 3. Detalle de productos o servicios
    this.observacionesProductos = '';

    // 4. Datos de la entrega
    this.departamento = '';
    this.municipio = '';
    this.direccion = '';
    this.contacto = '';
    this.telefono = '';
    this.fechaEntrega = '';
    this.requiereFlete = false;
    this.garantias = '';
    this.departamentoId = null;
    this.departamentoNombre = '';
    this.areaNombre = '';

    if (init) Object.assign(this, init);
  }

  // Primera Ley: "El sistema no debe dañar al usuario ni, por inacción, permitir daño."
  // Validaciones básicas que previenen envíos corruptos.
  validar({ requireOrderName = true } = {}) {
    if (requireOrderName && (!this.nombreOrden || !this.nombreOrden.trim())) {
      throw new Error('El nombre de la orden es obligatorio.');
    }
    if (!this.subdireccion || !this.descripcionNecesidad) {
      throw new Error('Los datos de la solicitud son obligatorios (subdirección y descripción).');
    }
    if (this.proyectos.length === 0) {
      throw new Error('Debe agregar al menos un proyecto (Datos financieros).');
    }

    const proyectoSinPorcentaje = this.proyectos.find(
      (proyecto) => !proyecto.porcentaje || proyecto.porcentaje <= 0
    );
    if (proyectoSinPorcentaje) {
      const planName =
        proyectoSinPorcentaje.planAbastecimiento ||
        proyectoSinPorcentaje.item ||
        'Seleccionado';
      throw new Error(
        `El proyecto "${planName}" debe tener un porcentaje mayor a 0.`
      );
    }

    const porcentajesPorRubro = {};
    for (const proyecto of this.proyectos) {
      const clave = `${proyecto.planAbastecimientoId || ''}::${proyecto.itemId || ''}`;
      porcentajesPorRubro[clave] =
        (porcentajesPorRubro[clave] || 0) + (Number(proyecto.porcentaje) || 0);
    }

    const rubroExcedido = Object.entries(porcentajesPorRubro).find(
      ([, total]) => total > 100
    );
    if (rubroExcedido) {
      throw new Error(
        'La suma de porcentajes para un mismo plan y rubro no puede superar el 100%.'
      );
    }
    
    // Cada proyecto debe tener al menos un producto
    const proySinProductos = this.proyectos.find(p => !p.productosServicios || p.productosServicios.length === 0);
    if (proySinProductos) {
      const planName = proySinProductos.planAbastecimiento || proySinProductos.item || 'Seleccionado';
      throw new Error(`El proyecto "${planName}" no tiene productos o servicios registrados.`);
    }

    
    // La validación de aprobadores ha sido removida por requerimiento del usuario.
    
    return true;
  }
}
