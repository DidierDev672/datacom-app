import axios from 'axios';
import { URL_API } from '../../utils/config';

export const state = {
    loading: false,
    error: null,
    items: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
};

export const mutations = {
    SET_LOADING(state, value) {
        state.loading = value;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_DATA(state, { items, page, size, totalElements, totalPages }) {
        state.items = items || [];
        state.page = typeof page === 'number' ? page : 0;
        state.size = typeof size === 'number' ? size : 10;
        state.totalElements = typeof totalElements === 'number' ? totalElements : 0;
        state.totalPages = typeof totalPages === 'number' ? totalPages : 0;
    },
};

export const actions = {
    async searchSuppliers({ commit }, { name = '', nit = '', page = 0, size = 10 }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await axios.get(`${URL_API}/api/suppliers/search`, {
                params: { name, nit, page, size }
            });
            const body = response.data && response.data.results ? response.data.results : null;
            const items = body && Array.isArray(body.items) ? body.items : [];
            const totalElements = body && typeof body.totalElements === 'number' ? body.totalElements : items.length;
            const totalPages = body && typeof body.totalPages === 'number' ? body.totalPages : 1;
            const currentPage = body && typeof body.page === 'number' ? body.page : page;
            const pageSize = body && typeof body.size === 'number' ? body.size : size;
            commit('SET_DATA', { items, page: currentPage, size: pageSize, totalElements, totalPages });
            return { items, totalElements, totalPages, page: currentPage, size: pageSize };
        } catch (error) {
            console.error('Error al buscar proveedores:', error);
            commit('SET_ERROR', error.message || 'Error al buscar proveedores');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
};

export const getters = {
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getItems: (state) => state.items,
    getPage: (state) => state.page,
    getSize: (state) => state.size,
    getTotalElements: (state) => state.totalElements,
    getTotalPages: (state) => state.totalPages,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};


