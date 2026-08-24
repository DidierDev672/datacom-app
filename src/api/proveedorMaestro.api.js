import client from './client';

export default {
  getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.q) params.append('q', filters.q);
    const qs = params.toString();
    return client.get(`/api/v1/proveedores${qs ? '?' + qs : ''}`);
  },

  getById(id) {
    return client.get(`/api/v1/proveedores/${id}`);
  },

  create(payload) {
    return client.post('/api/v1/proveedores', payload);
  },

  update(id, payload) {
    return client.patch(`/api/v1/proveedores/${id}`, payload);
  },

  toggleEstado(id) {
    return client.patch(`/api/v1/proveedores/${id}/estado`);
  },

  cambiarEstado(id, estado) {
    return client.patch(`/api/v1/proveedores/${id}/estado?estado=${estado}`);
  }
};
