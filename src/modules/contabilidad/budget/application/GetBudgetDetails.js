import { BudgetDetailRepositoryHttp } from '../infrastructure/BudgetDetailRepositoryHttp';

export class GetBudgetDetails {
  constructor (repository = new BudgetDetailRepositoryHttp()) {
    this.repository = repository;
  }

  async execute (budgetId) {
    if (!budgetId) {
      throw new Error('El presupuesto es requerido.');
    }
    const result = await this.repository.getAllByBudgetId(budgetId);
    return Array.isArray(result) ? result : [];
  }
}
