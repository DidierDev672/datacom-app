import api from '../../api/ordenCompra.api';

const state = {
  ordenes: [],
  ordenActual: null,
  isLoading: false,
  error: null
};

const mutations = {
  SET_ORDENES(state, ordenes) {
    state.ordenes = ordenes;
  },
  SET_ORDEN_ACTUAL(state, orden) {
    state.ordenActual = orden;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_ORDEN(state, orden) {
    state.ordenes.unshift(orden);
  },
  UPDATE_ORDEN(state, orden) {
    const index = state.ordenes.findIndex(o => o.idOrden === orden.idOrden);
    if (index !== -1) {
      state.ordenes.splice(index, 1, orden);
      if (state.ordenActual && state.ordenActual.idOrden === orden.idOrden) {
        state.ordenActual = orden;
      }
    }
  }
};

const actions = {
  async fetchAll({ commit }, filters) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.getAll(filters);
      commit('SET_ORDENES', response.data);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error cargando ordenes');
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async fetchById({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.getById(id);
      commit('SET_ORDEN_ACTUAL', response.data);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error cargando la orden');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createOrden({ commit }, payload) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.create(payload);
      commit('ADD_ORDEN', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error creando la orden');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateOrden({ commit }, { id, payload }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.update(id, payload);
      commit('UPDATE_ORDEN', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error actualizando la orden');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateItems({ commit }, { id, items }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.updateItems(id, items);
      commit('UPDATE_ORDEN', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error actualizando ítems');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await api.updateStatus(id, status);
      commit('UPDATE_ORDEN', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Error actualizando estado');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  ordenesActivas: state => state.ordenes.filter(o => o.status !== 'ANULADA'),
  totalOrdenes: state => state.ordenes.length
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
