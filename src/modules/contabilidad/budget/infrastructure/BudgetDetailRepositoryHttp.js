import { IBudgetDetailRepository } from '../domain/IBudgetDetailRepository';
import { budgetDetailApi } from 'src/api/budgetDetail.api';

export class BudgetDetailRepositoryHttp extends IBudgetDetailRepository {
  getAllByBudgetId (budgetId) {
    return budgetDetailApi.getAll(budgetId);
  }

  getById (budgetId, detailId) {
    return budgetDetailApi.getById(budgetId, detailId);
  }

  create (budgetId, detail) {
    return budgetDetailApi.create(budgetId, detail);
  }

  update (budgetId, detailId, detail) {
    return budgetDetailApi.update(budgetId, detailId, detail);
  }

  delete (budgetId, detailId) {
    return budgetDetailApi.remove(budgetId, detailId);
  }
}
