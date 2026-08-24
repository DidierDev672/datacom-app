import client from './client';

const BASE_URL = '/api/v1/budget';

export const budgetApi = {
  /**
   * Obtiene todos los presupuestos.
   * @param {Object} [params] - Filtros opcionales (fiscalYear, q)
   * @returns {Promise<Array>}
   */
  async getAll (params) {
    const response = await client.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Obtiene un presupuesto por su ID.
   * @param {string} id - UUID del presupuesto
   * @returns {Promise<Object>}
   */
  async getById (id) {
    const response = await client.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo presupuesto.
   * Payload: { id, name, fiscal_year, responsible_area, cost_center_id, status }
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async create (payload) {
    const response = await client.post(BASE_URL, payload);
    return response.data;
  },

  /**
   * Actualiza un presupuesto existente.
   * @param {string} id - UUID del presupuesto
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async update (id, payload) {
    const response = await client.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  /**
   * Elimina un presupuesto.
   * @param {string} id - UUID del presupuesto
   */
  async remove (id) {
    await client.delete(`${BASE_URL}/${id}`);
  }
};
