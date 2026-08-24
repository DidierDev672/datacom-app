import { ICostCenterRepository } from '../domain/ICostCenterRepository';
import { costCenterApi } from 'src/api/costCenter.api';

/**
 * Adaptador HTTP para el repositorio de Centros de Costo.
 * Implementa el puerto ICostCenterRepository usando el cliente axios centralizado.
 *
 * Arquitectura Hexagonal: esta clase vive en la capa de Infraestructura.
 * Si la API cambia, solo se modifica este adaptador; los casos de uso no se tocan.
 */
export class CostCenterRepositoryHttp extends ICostCenterRepository {
  async getAll (params) {
    return costCenterApi.getAll(params);
  }

  async getById (id) {
    return costCenterApi.getById(id);
  }

  async create (costCenter) {
    return costCenterApi.create(costCenter);
  }

  async update (id, costCenter) {
    return costCenterApi.update(id, costCenter);
  }

  async delete (id) {
    return costCenterApi.remove(id);
  }
}
