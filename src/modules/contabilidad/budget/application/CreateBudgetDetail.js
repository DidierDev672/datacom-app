import { BudgetDetailRepositoryHttp } from '../infrastructure/BudgetDetailRepositoryHttp';

export class CreateBudgetDetail {
  constructor (repository = new BudgetDetailRepositoryHttp()) {
    this.repository = repository;
  }

  async execute (budgetId, detail) {
    if (!budgetId) {
      throw new Error('El presupuesto es requerido para registrar un detalle.');
    }
    return this.repository.create(budgetId, detail);
  }
}
