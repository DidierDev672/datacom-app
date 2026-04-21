import client from './client';

export const solicitudTerrestreApi = {
  create: (data) => client.post('/api/v1/solicitudes-terrestre', data),

  fetchAll: (filters = {}) => {
    const params = {};
    if (filters.status && filters.status !== '') {
      params.status = filters.status;
    }
    if (filters.proyecto && filters.proyecto.trim() !== '') {
      params.proyecto = filters.proyecto.trim();
    }
    return client.get('/api/v1/solicitudes-terrestre', { params });
  },

  updateStatus: (id, status) => client.patch(`/api/v1/solicitudes-terrestre/${id}/status`, null, {
    params: { status }
  }),

  update: (id, data) => client.patch(`/api/v1/solicitudes-terrestre/${id}`, data),

  delete: (id) => client.delete(`/api/v1/solicitudes-terrestre/${id}`),

  replacePassenger: (id, passengerOrder, passengerData) =>
    client.patch(`/api/v1/solicitudes-terrestre/${id}/pasajeros/${passengerOrder}`, passengerData)
};
