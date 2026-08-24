import client from './client';

export const colaboradoresApi = {
  /**
   * Obtiene todos los colaboradores registrados en el sistema.
   * GET /api/v1/colaboradores
   * @returns {Promise<Array>} Lista de colaboradores
   */
  async getAll() {
    const response = await client.get('/api/v1/colaboradores');
    return response.data;
  },

  /**
   * Registra un nuevo colaborador.
   * POST /api/v1/colaboradores
   * @param {Object} payload - ColaboradorDTO
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const response = await client.post('/api/v1/colaboradores', payload);
    return response.data;
  },

  /**
   * Busca colaboradores por nombre o código.
   * Filtra en el frontend para mantener compatibilidad con la interfaz existente.
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Array>} Lista filtrada de colaboradores
   */
  /**
   * Actualiza los datos básicos de un colaborador.
   * PUT /api/v1/colaboradores/{id}
   * @param {string} id
   * @param {Object} payload - ColaboradorDTO
   * @returns {Promise<Object>}
   */
  async update(id, payload) {
    const response = await client.put(`/api/v1/colaboradores/${id}`, payload);
    return response.data;
  },

  async search(term) {
    const all = await this.getAll();
    if (!term || !term.trim()) {
      return all.filter(c => c.estado === 'Activo' || c.estado === 'ACTIVO');
    }
    const lowerTerm = term.toLowerCase().trim();
    return all.filter(c => {
      const matchesSearch = (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(lowerTerm)) ||
                           (c.codigoCargo && c.codigoCargo.toLowerCase().includes(lowerTerm)) ||
                           (c.numeroDocumento && c.numeroDocumento.toLowerCase().includes(lowerTerm));
      const isActive = c.estado === 'Activo' || c.estado === 'ACTIVO';
      return matchesSearch && isActive;
    });
  }
};
