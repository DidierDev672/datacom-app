import client from './client';

export const solicitudTransporteApi = {
    fetchAll: (filters) => client.get('/api/v1/solicitudes-transporte', { params: filters }),
    fetchById: (id) => client.get(`/api/v1/solicitudes-transporte/${id}`),
    create: (payload) => client.post('/api/v1/solicitudes-transporte', payload),
    update: (id, payload) => client.patch(`/api/v1/solicitudes-transporte/${id}`, payload),
    updatePasajeros: (id, pasajeros) => client.patch(`/api/v1/solicitudes-transporte/${id}/pasajeros`, pasajeros),
    updateStatus: (id, status) => client.patch(`/api/v1/solicitudes-transporte/${id}/status`, { status })
};
