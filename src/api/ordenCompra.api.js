import client from './client';

export default {
  getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return client.get(`/api/v1/ordenes-compra${params ? '?' + params : ''}`);
  },
  
  getById(id) {
    return client.get(`/api/v1/ordenes-compra/${id}`);
  },
  
  create(payload) {
    return client.post('/api/v1/ordenes-compra', payload);
  },
  
  update(id, payload) {
    return client.patch(`/api/v1/ordenes-compra/${id}`, payload);
  },
  
  updateItems(id, items) {
    return client.patch(`/api/v1/ordenes-compra/${id}/items`, items);
  },
  
  updateStatus(id, status) {
    return client.patch(`/api/v1/ordenes-compra/${id}/status?status=${status}`);
  }
}
