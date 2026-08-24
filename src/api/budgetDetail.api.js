import client from './client';

const baseUrl = (budgetId) => `/api/v1/budget/${budgetId}/details`;

export const budgetDetailApi = {
  async getAll (budgetId) {
    const response = await client.get(baseUrl(budgetId));
    return response.data;
  },

  async getById (budgetId, detailId) {
    const response = await client.get(`${baseUrl(budgetId)}/${detailId}`);
    return response.data;
  },

  /**
   * Crea un detalle. El ID y la fecha los genera el backend.
   * Payload: { areaName, description, quantity, spentAmount, orderTotal }
   */
  async create (budgetId, payload) {
    const response = await client.post(baseUrl(budgetId), payload);
    return response.data;
  },

  async update (budgetId, detailId, payload) {
    const response = await client.put(`${baseUrl(budgetId)}/${detailId}`, payload);
    return response.data;
  },

  async remove (budgetId, detailId) {
    await client.delete(`${baseUrl(budgetId)}/${detailId}`);
  }
};
