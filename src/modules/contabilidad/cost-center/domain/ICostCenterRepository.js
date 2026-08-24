/**
 * Puerto de dominio para el repositorio de Centros de Costo.
 * Sigue SOLID — Inversión de Dependencias e Interface Segregation.
 *
 * Ningún caso de uso depende de la implementación concreta (HTTP, mock, etc.),
 * sino de este contrato, garantizando desacoplamiento total de infraestructura.
 */
export class ICostCenterRepository {
  /**
   * Obtiene todos los centros de costo.
   * @returns {Promise<Array>}
   */
  async getAll () {
    throw new Error('ICostCenterRepository.getAll() no implementado');
  }

  /**
   * Obtiene un centro de costo por su UUID.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getById (id) {
    throw new Error('ICostCenterRepository.getById() no implementado');
  }

  /**
   * Crea un nuevo centro de costo.
   * @param {{ id: string, code: string, name: string, budget: number, state: string }} costCenter
   * @returns {Promise<Object>}
   */
  async create (costCenter) {
    throw new Error('ICostCenterRepository.create() no implementado');
  }

  /**
   * Actualiza un centro de costo existente.
   * @param {string} id
   * @param {Object} costCenter
   * @returns {Promise<Object>}
   */
  async update (id, costCenter) {
    throw new Error('ICostCenterRepository.update() no implementado');
  }

  /**
   * Elimina un centro de costo.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete (id) {
    throw new Error('ICostCenterRepository.delete() no implementado');
  }
}
