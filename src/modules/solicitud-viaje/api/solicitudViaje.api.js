import client from 'src/api/client';

export const solicitudViajeApi = {
  create: (data) => client.post('/api/v1/solicitudes-viaje', data),
  getAll: () => client.get('/api/v1/solicitudes-viaje'),
  getById: (id) => client.get(`/api/v1/solicitudes-viaje/${id}`),
  update: (id, data) => client.put(`/api/v1/solicitudes-viaje/${id}`, data)
};
