/**
 * Domain Objects for Solicitud Abastecimiento
 */

export class SolicitudAbastecimiento {
  constructor(init) {
    // 1. Datos de la solicitud
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

    if (init) Object.assign(this, init);
  }

  // Primera Ley: "El sistema no debe dañar al usuario ni, por inacción, permitir daño."
  // Validaciones básicas que previenen envíos corruptos.
  validar() {
    if (!this.subdireccion || !this.descripcionNecesidad) {
      throw new Error('Los datos de la solicitud son obligatorios (subdirección y descripción).');
    }
    if (this.proyectos.length === 0) {
      throw new Error('Debe agregar al menos un proyecto (Datos financieros).');
    }
    
    // Cada proyecto debe tener al menos un producto
    const proySinProductos = this.proyectos.find(p => !p.productosServicios || p.productosServicios.length === 0);
    if (proySinProductos) {
      const planName = proySinProductos.planAbastecimiento || proySinProductos.item || 'Seleccionado';
      throw new Error(`El proyecto "${planName}" no tiene productos o servicios registrados.`);
    }

    if (!this.departamento || !this.municipio || !this.direccion || !this.fechaEntrega) {
      throw new Error('Los campos de entrega (departamento, municipio, dirección y fecha) son obligatorios.');
    }
    
    // La validación de aprobadores ha sido removida por requerimiento del usuario.
    
    return true;
  }
}
