/**
 * Puerto de dominio para detalles de presupuesto.
 */
export class IBudgetDetailRepository {
  async getAllByBudgetId (budgetId) {
    throw new Error('IBudgetDetailRepository.getAllByBudgetId() no implementado');
  }

  async getById (budgetId, detailId) {
    throw new Error('IBudgetDetailRepository.getById() no implementado');
  }

  async create (budgetId, detail) {
    throw new Error('IBudgetDetailRepository.create() no implementado');
  }

  async update (budgetId, detailId, detail) {
    throw new Error('IBudgetDetailRepository.update() no implementado');
  }

  async delete (budgetId, detailId) {
    throw new Error('IBudgetDetailRepository.delete() no implementado');
  }
}
