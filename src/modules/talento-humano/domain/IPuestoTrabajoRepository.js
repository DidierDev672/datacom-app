/**
 * Interface that defines the persistence contract for Puesto de Trabajo.
 * Follows SOLID - Dependency Inversion and Interface Segregation.
 */
export class IPuestoTrabajoRepository {
  async getAll() {
    throw new Error('Not implemented');
  }

  async getById(id) {
    throw new Error('Not implemented');
  }

  async create(puestoTrabajo) {
    throw new Error('Not implemented');
  }

  async update(id, puestoTrabajo) {
    throw new Error('Not implemented');
  }

  async delete(id) {
    throw new Error('Not implemented');
  }
}
