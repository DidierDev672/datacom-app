import { IBudgetRepository } from '../domain/IBudgetRepository';
import { budgetApi } from 'src/api/budget.api';

/**
 * Adaptador HTTP para el repositorio de Presupuestos.
 * Implementa el puerto IBudgetRepository usando el cliente axios centralizado.
 */
export class BudgetRepositoryHttp extends IBudgetRepository {
  async getAll (params) {
    return budgetApi.getAll(params);
  }

  async getById (id) {
    return budgetApi.getById(id);
  }

  async create (budget) {
    return budgetApi.create(budget);
  }

  async update (id, budget) {
    return budgetApi.update(id, budget);
  }

  async delete (id) {
    return budgetApi.remove(id);
  }
}
