/**
 * Permisos operativos por colaborador y departamento.
 */
import client from 'src/api/client';

const BASE = '/api/v1/colaborador-permisos';

/**
 * @typedef {Object} ColaboradorPermisoPayload
 * @property {string} colaboradorId
 * @property {number} departamentoId
 * @property {boolean} permisoCompras
 * @property {boolean} permisoAprobaciones
 * @property {boolean} permisoCreacionUsuarios
 * @property {boolean} permisoEliminacionUsuarios
 * @property {boolean} permisoEliminacionCompras
 * @property {boolean} permisoEliminacionSolicitudes
 */

export const colaboradorPermisosApi = {
  /**
   * Crea o actualiza la asignación de permisos (upsert por colaborador + departamento).
   * POST /api/v1/colaborador-permisos
   * @param {ColaboradorPermisoPayload} payload
   */
  createOrUpdate (payload) {
    return client.post(BASE, payload).then(function (r) {
      return r.data;
    });
  },

  /**
   * Lista todas las asignaciones.
   * GET /api/v1/colaborador-permisos
   */
  getAll () {
    return client.get(BASE).then(function (r) {
      return r.data;
    });
  },

  /**
   * Obtiene una asignación por id.
   * GET /api/v1/colaborador-permisos/{id}
   * @param {number|string} id
   */
  getById (id) {
    return client.get(BASE + '/' + id).then(function (r) {
      return r.data;
    });
  },

  /**
   * Lista permisos de un colaborador.
   * GET /api/v1/colaborador-permisos/colaborador/{colaboradorId}
   * @param {string} colaboradorId
   */
  getByColaborador (colaboradorId) {
    return client.get(BASE + '/colaborador/' + encodeURIComponent(colaboradorId)).then(function (r) {
      return r.data;
    });
  },

  /**
   * Lista permisos de un departamento.
   * GET /api/v1/colaborador-permisos/departamento/{departamentoId}
   * @param {number|string} departamentoId
   */
  getByDepartamento (departamentoId) {
    return client.get(BASE + '/departamento/' + departamentoId).then(function (r) {
      return r.data;
    });
  },

  /**
   * Actualiza una asignación existente.
   * PUT /api/v1/colaborador-permisos/{id}
   * @param {number|string} id
   * @param {ColaboradorPermisoPayload} payload
   */
  update (id, payload) {
    return client.put(BASE + '/' + id, payload).then(function (r) {
      return r.data;
    });
  },

  /**
   * Elimina una asignación.
   * DELETE /api/v1/colaborador-permisos/{id}
   * @param {number|string} id
   */
  remove (id) {
    return client.delete(BASE + '/' + id);
  },

  /**
   * Obtiene las asignaciones del usuario autenticado.
   * GET /api/v1/colaborador-permisos/sesion
   */
  getSesion () {
    return client.get(BASE + '/sesion').then(function (r) {
      return r.data;
    });
  },

  /**
   * Crea o actualiza permisos del usuario autenticado.
   * PUT /api/v1/colaborador-permisos/sesion
   * @param {Omit<ColaboradorPermisoPayload, 'colaboradorId'>} payload
   */
  updateSesion (payload) {
    return client.put(BASE + '/sesion', payload).then(function (r) {
      return r.data;
    });
  },

  /**
   * Guarda la configuración de visibilidad de componentes.
   * POST /api/v1/colaborador-permisos/visibilidad
   * @param {Object} payload - Mapa de flags de visibilidad
   */
  saveVisibilidad (payload) {
    return client.post(BASE + '/visibilidad', payload).then(function (r) {
      return r.data;
    });
  }
};
