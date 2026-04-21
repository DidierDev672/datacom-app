/**
 * Interface that defines the persistence contract for SolicitudAbastecimiento.
 * Follows SOLID - Dependency Inversion and Interface Segregation.
 * Since this is JS, this acts mostly as documentation.
 */
export class ISolicitudRepository {
  async crearSolicitud(solicitud) {
    throw new Error('Not implemented');
  }

  async aprobar(id, aprobadores) {
    throw new Error('Not implemented');
  }

  async rechazar(id) {
    throw new Error('Not implemented');
  }

  async eliminar(id) {
    throw new Error('Not implemented');
  }
}
