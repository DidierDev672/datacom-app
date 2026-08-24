import { BudgetDetailRepositoryHttp } from '../infrastructure/BudgetDetailRepositoryHttp';

export class UpdateBudgetDetail {
  constructor (repository = new BudgetDetailRepositoryHttp()) {
    this.repository = repository;
  }

  async execute (budgetId, detailId, detail) {
    if (!budgetId || !detailId) {
      throw new Error('Presupuesto y detalle son requeridos.');
    }
    return this.repository.update(budgetId, detailId, detail);
  }
}
