/**
 * Comparativo de cotizaciones — usa el mismo cliente que el resto de la app
 * (JWT, X-Tenantid, URL_API desde env).
 */
import client from 'src/api/client';

const BASE = '/api/v1/cotizaciones';

export const cotizacionApi = {
  create: (data) => client.post(BASE, data),
  getAll: (filters) => client.get(BASE, { params: filters || {} }),
  getById: (id) => client.get(BASE + '/' + id),
  getComparativo: (id) => client.get(BASE + '/' + id + '/comparativo'),
  setGanador: (id, proveedorId) =>
    client.patch(BASE + '/' + id + '/ganador?proveedorId=' + encodeURIComponent(proveedorId)),
  updateStatus: (id, status) =>
    client.patch(BASE + '/' + id + '/status?status=' + encodeURIComponent(status))
};
