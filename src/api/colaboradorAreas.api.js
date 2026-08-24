import client from './client';

export const colaboradorAreasApi = {
  async obtenerVisibilidad(colaboradorId, usuarioId) {
    var params = {};
    if (colaboradorId) params.colaboradorId = colaboradorId;
    if (usuarioId) params.usuarioId = usuarioId;
    const response = await client.get('/api/v1/colaborador-asignaciones/visibilidad', { params });
    return response.data;
  },
  async guardarVisibilidad(payload) {
    const response = await client.post('/api/v1/colaborador-asignaciones/visibilidad', payload);
    return response.data;
  },
  async listarTodas() {
    const response = await client.get('/api/v1/colaborador-asignaciones');
    return response.data;
  },
  async asignar(colaboradorId, departamentoIds) {
    const response = await client.post('/api/v1/colaborador-asignaciones', {
      colaboradorId,
      departamentoIds,
    });
    return response.data;
  },

  async getAsignaciones(colaboradorId, usuarioId) {
    var params = {};
    if (colaboradorId) params.colaboradorId = colaboradorId;
    if (usuarioId) params.usuarioId = usuarioId;
    const response = await client.get('/api/v1/colaborador-asignaciones', { params });
    return response.data;
  },

  async getColaboradoresPorDepartamento(departamentoId) {
    const response = await client.get(`/api/v1/colaborador-asignaciones/departamento/${departamentoId}`);
    return response.data;
  },
};
