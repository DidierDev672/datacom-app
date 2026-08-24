/**
 * Aprobadores del sistema (crear / actualizar / eliminar).
 */
import client from 'src/api/client';

const BASE = '/api/v1/aprobadores';

/**
 * @param {{ collaboratorId: string, puedeCrear: boolean, puedeActualizar: boolean, puedeEliminar: boolean }} payload
 */
export function createAprobador (payload) {
  return client.post(BASE, payload).then(function (r) {
    return r.data;
  });
}

export function listAprobadores () {
  return client.get(BASE).then(function (r) {
    return r.data;
  });
}
