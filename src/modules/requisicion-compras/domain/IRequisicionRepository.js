export class IRequisicionRepository {
  async crear(requisicion) {
    throw new Error('Not implemented');
  }

  async obtenerTodas(filters) {
    throw new Error('Not implemented');
  }

  async obtenerPorId(id) {
    throw new Error('Not implemented');
  }

  async actualizar(id, requisicion) {
    throw new Error('Not implemented');
  }

  async reemplazarItems(id, items) {
    throw new Error('Not implemented');
  }

  async actualizarStatus(id, status) {
    throw new Error('Not implemented');
  }
}
