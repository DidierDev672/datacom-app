import client from './client';

const BASE_URL = '/api/v1/cost-center';

export const costCenterApi = {
  /**
   * Obtiene todos los centros de costo.
   * @returns {Promise<Array>}
   */
  async getAll (params) {
    const response = await client.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Obtiene un centro de costo por su ID.
   * @param {string} id - UUID del centro de costo
   * @returns {Promise<Object>}
   */
  async getById (id) {
    const response = await client.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo centro de costo.
   * Payload: { id, code, name, budget, state }
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async create (payload) {
    const response = await client.post(BASE_URL, payload);
    return response.data;
  },

  /**
   * Actualiza un centro de costo existente.
   * @param {string} id - UUID del centro de costo
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async update (id, payload) {
    const response = await client.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  /**
   * Actualiza únicamente el estado del centro de costo.
   * @param {string} id - UUID del centro de costo
   * @param {string} state - "ACTIVE" | "INACTIVE" | "COMPLETED"
   */
  async updateState (id, state) {
    await client.patch(`${BASE_URL}/${id}/state`, null, { params: { state } });
  },

  /**
   * Elimina un centro de costo.
   * @param {string} id - UUID del centro de costo
   */
  async remove (id) {
    await client.delete(`${BASE_URL}/${id}`);
  }
};
