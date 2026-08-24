/**
 * Solicitud / requerimiento de viaje administrativo (Abastecimiento).
 */
import client from 'src/api/client';

const BASE = '/api/v1/solicitudes-requerimiento-viaje';

/** @typedef {Record<string, any>} SolicitudReqViajePayload */

/**
 * Lista solicitudes (opcional params futuros para filtros).
 * @param {Record<string, any>} params
 */
export function listRequerimientoViajes (params) {
  return client
    .get(BASE, { params: params || {} })
    .then(function (r) {
      return r.data;
    });
}

/**
 * @param {number|string} id
 */
export function getRequerimientoViajeById (id) {
  return client.get(BASE + '/' + id).then(function (r) {
    return r.data;
  });
}

/**
 * Crea la solicitud. El backend asigna `codigo` automáticamente.
 * @param {SolicitudReqViajePayload} payload
 */
export function createRequerimientoViaje (payload) {
  return client.post(BASE, payload).then(function (r) {
    return r.data;
  });
}

/**
 * PATCH estado: REVISION | APROBACION | RECHAZADA
 * @param {number|string} id
 * @param {{ estado: string }} body
 */
export function patchRequerimientoViajeEstado (id, body) {
  return client.patch(BASE + '/' + id + '/estado', body).then(function (r) {
    return r.data;
  });
}
