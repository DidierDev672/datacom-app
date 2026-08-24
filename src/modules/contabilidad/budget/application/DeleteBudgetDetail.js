import { BudgetDetailRepositoryHttp } from '../infrastructure/BudgetDetailRepositoryHttp';

export class DeleteBudgetDetail {
  constructor (repository = new BudgetDetailRepositoryHttp()) {
    this.repository = repository;
  }

  async execute (budgetId, detailId) {
    if (!budgetId || !detailId) {
      throw new Error('Presupuesto y detalle son requeridos.');
    }
    return this.repository.delete(budgetId, detailId);
  }
}
