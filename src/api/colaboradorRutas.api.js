/**
 * Rutas asignadas a colaboradores (Vue Router paths).
 */
import client from 'src/api/client';

const BASE = '/api/v1/colaborador-rutas';

export const colaboradorRutasApi = {
  async getByColaborador(colaboradorId) {
    const response = await client.get(`${BASE}/${colaboradorId}`);
    return response.data;
  },

  async guardar(colaboradorId, rutaPaths, rutaNombres) {
    const response = await client.post(BASE, {
      colaboradorId,
      rutaPaths,
      rutaNombres,
    });
    return response.data;
  },
};
