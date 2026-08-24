import client from "./client";

/**
 * API de gestión de usuarios vinculados a colaboradores (empleados).
 * Base: /api/user-access
 */
export const userAccessApi = {
  /**
   * Lista colaboradores activos que aún no tienen acceso al sistema.
   * GET /api/user-access/collaborators-without-access
   * @param {string} [search]
   * @returns {Promise<Array>}
   */
  async getCollaboratorsWithoutAccess(search) {
    const response = await client.get(
      "/api/user-access/collaborators-without-access",
      {
        params: search ? { search } : undefined,
      }
    );
    return response.data;
  },

  /**
   * Sugiere un username para un colaborador.
   * GET /api/user-access/username-suggestion
   * @param {string} collaboratorId
   * @returns {Promise<{ primary: string, alternative: string, available: boolean }>}
   */
  async suggestUsername(collaboratorId) {
    const response = await client.get("/api/user-access/username-suggestion", {
      params: { collaboratorId },
    });
    return response.data;
  },

  /**
   * Verifica si un username está disponible.
   * GET /api/user-access/check-username
   * @param {string} username
   * @returns {Promise<{ available: boolean }>}
   */
  async checkUsername(username, excludeAccessId) {
    const params = { username };
    if (excludeAccessId != null) {
      params.excludeAccessId = excludeAccessId;
    }
    const response = await client.get("/api/user-access/check-username", {
      params,
    });
    return response.data;
  },

  /**
   * Genera un token de acceso en el servidor.
   * POST /api/user-access/generate-token
   * @returns {Promise<{ token: string }>}
   */
  async generateToken() {
    const response = await client.post("/api/user-access/generate-token");
    return response.data;
  },

  /**
   * Crea un usuario vinculado a un colaborador.
   * POST /api/user-access
   * @param {Object} payload
   * @param {string} payload.collaboratorId
   * @param {string} payload.username
   * @param {string} payload.password
   * @param {string|null} [payload.accessToken]
   * @param {boolean} payload.active
   * @param {boolean} payload.forcePasswordChange
   * @param {boolean} payload.sendWelcomeEmail
   * @param {boolean} payload.requireMfa
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const response = await client.post("/api/user-access", payload);
    return response.data;
  },

  /**
   * Actualiza credenciales y opciones de un acceso existente.
   * PUT /api/user-access/{accessId}
   * @param {number} accessId
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async update(accessId, payload) {
    const response = await client.put(`/api/user-access/${accessId}`, payload);
    return response.data;
  },

  /**
   * Consulta si un colaborador ya tiene acceso al sistema.
   * GET /api/user-access/collaborator/{collaboratorId}
   * @param {string} collaboratorId
   * @returns {Promise<{ hasAccess: boolean, accessId: number|null, username?: string }>}
   */
  async getStatusByCollaborator(collaboratorId) {
    const response = await client.get(
      `/api/user-access/collaborator/${collaboratorId}`
    );
    return response.data;
  },
};
