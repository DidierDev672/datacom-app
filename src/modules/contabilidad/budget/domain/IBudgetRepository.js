/**
 * Puerto de dominio para el repositorio de Presupuestos.
 * Sigue SOLID — Inversión de Dependencias e Interface Segregation.
 */
export class IBudgetRepository {
  async getAll () {
    throw new Error('IBudgetRepository.getAll() no implementado');
  }

  async getById (id) {
    throw new Error('IBudgetRepository.getById() no implementado');
  }

  async create (budget) {
    throw new Error('IBudgetRepository.create() no implementado');
  }

  async update (id, budget) {
    throw new Error('IBudgetRepository.update() no implementado');
  }

  async delete (id) {
    throw new Error('IBudgetRepository.delete() no implementado');
  }
}
