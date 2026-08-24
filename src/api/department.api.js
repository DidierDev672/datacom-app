import client from './client';

export const departmentApi = {
  async getAll(params) {
    const response = await client.get('/api/v1/departments', { params });
    return response.data;
  },

  async getById(id) {
    const response = await client.get(`/api/v1/departments/${id}`);
    return response.data;
  },

  async create(payload) {
    const response = await client.post('/api/v1/departments', payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await client.put(`/api/v1/departments/${id}`, payload);
    return response.data;
  },

  async updateStatus(id, status) {
    await client.patch(`/api/v1/departments/${id}/status`, null, { params: { status } });
  },

  async remove(id) {
    await client.delete(`/api/v1/departments/${id}`);
  }
};
