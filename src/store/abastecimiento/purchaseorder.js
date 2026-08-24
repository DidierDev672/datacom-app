import axios from 'axios';
import { URL_API } from '../../utils/config';

export const state = {
    creating: false,
    loading: false,
    error: null,
    list: [],
    current: null,
    suppliersLoading: false,
    suppliersError: null,
    suppliers: [],
    suppliersPage: 0,
    suppliersSize: 10,
    suppliersTotalElements: 0,
    suppliersTotalPages: 0,
};

export const mutations = {
    SET_CREATING(state, value) {
        state.creating = value;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_LOADING(state, value) {
        state.loading = value;
    },
    SET_LIST(state, orders) {
        state.list = orders || [];
    },
    SET_CURRENT(state, order) {
        state.current = order || null;
    },
    SUPPLIERS_SET_LOADING(state, value) {
        state.suppliersLoading = value;
    },
    SUPPLIERS_SET_ERROR(state, error) {
        state.suppliersError = error;
    },
    SUPPLIERS_SET_DATA(state, { items, page, size, totalElements, totalPages }) {
        state.suppliers = items || [];
        state.suppliersPage = typeof page === 'number' ? page : 0;
        state.suppliersSize = typeof size === 'number' ? size : 10;
        state.suppliersTotalElements = typeof totalElements === 'number' ? totalElements : 0;
        state.suppliersTotalPages = typeof totalPages === 'number' ? totalPages : 0;
    },
};

export const actions = {
    async createPurchaseOrder({ commit }, payload) {
        commit('SET_CREATING', true);
        commit('SET_ERROR', null);
        try {
            const response = await axios.post(`${URL_API}/api/purchase-order/`, payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear la PurchaseOrder:', error);
            commit('SET_ERROR', error.message || 'Error al crear la PurchaseOrder');
            throw error;
        } finally {
            commit('SET_CREATING', false);
        }
    },
    async fetchPurchaseOrders({ commit }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await axios.get(`${URL_API}/api/purchase-order/`);
            const orders = response.data && response.data.results ? response.data.results : response.data;
            commit('SET_LIST', orders || []);
            return orders || [];
        } catch (error) {
            console.error('Error al listar PurchaseOrders:', error);
            const responseData = error.response && error.response.data;
            let message = error.message || 'Error al listar órdenes de compra';
            if (responseData) {
                if (typeof responseData === 'string') {
                    message = responseData;
                } else if (responseData.message && responseData.message !== 'Internal Server Error') {
                    message = responseData.message;
                } else if (responseData.error && responseData.error.message) {
                    message = responseData.error.message;
                }
            }
            commit('SET_ERROR', message);
            commit('SET_LIST', []);
            throw new Error(message);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async searchSuppliers({ commit }, { name = '', nit = '', page = 0, size = 10 }) {
        commit('SUPPLIERS_SET_LOADING', true);
        commit('SUPPLIERS_SET_ERROR', null);
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
            commit('SUPPLIERS_SET_DATA', { items, page: currentPage, size: pageSize, totalElements, totalPages });
            return { items, totalElements, totalPages, page: currentPage, size: pageSize };
        } catch (error) {
            console.error('Error al buscar proveedores:', error);
            commit('SUPPLIERS_SET_ERROR', error.message || 'Error al buscar proveedores');
            throw error;
        } finally {
            commit('SUPPLIERS_SET_LOADING', false);
        }
    },

    async fetchPurchaseOrderById({ commit }, id) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await axios.get(`${URL_API}/api/purchase-order/${id}/detail`);
            const order = response.data && response.data.results ? response.data.results : response.data;
            commit('SET_CURRENT', order || null);
            return order || null;
        } catch (error) {
            console.error('Error al obtener PurchaseOrder:', error);
            commit('SET_ERROR', error.message || 'Error al obtener PurchaseOrder');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async closePurchaseOrder({ commit }, { id }) {
        commit('SET_CREATING', true);
        commit('SET_ERROR', null);
        try {
            const response = await axios.post(`${URL_API}/api/purchase-order/${id}/close`);
            return response.data;
        } catch (error) {
            console.error('Error al cerrar PurchaseOrder:', error);
            commit('SET_ERROR', error.message || 'Error al cerrar PurchaseOrder');
            throw error;
        } finally {
            commit('SET_CREATING', false);
        }
    },

    async printPurchaseOrder(_, { id, format }) {
        const response = await axios.get(`${URL_API}/api/purchase-order/${id}/export-to-excel`, {
            responseType: 'blob',
            params: format ? { format } : undefined
        });

        const headers = response.headers || {};
        const contentDisposition = headers['content-disposition'] || headers['Content-Disposition'] || '';
        let filename = '';
        if (contentDisposition) {
            // Try RFC5987 first: filename*=UTF-8''...
            const rfc5987 = /filename\*=UTF-8''([^;]+)(?:;|$)/i.exec(contentDisposition);
            const basic = /filename="?([^";]+)"?/i.exec(contentDisposition);
            const raw = rfc5987 ? rfc5987[1] : (basic ? basic[1] : '');
            try { filename = decodeURIComponent(raw); } catch (e) { filename = raw; }
        }
        const contentType = headers['content-type'] || headers['Content-Type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        return { blob: response.data, filename, contentType };
    },
};

export const getters = {
    getCreating: (state) => state.creating,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getList: (state) => state.list,
    getCurrent: (state) => state.current,
    // suppliers
    getSuppliersLoading: (state) => state.suppliersLoading,
    getSuppliersError: (state) => state.suppliersError,
    getSuppliers: (state) => state.suppliers,
    getSuppliersPage: (state) => state.suppliersPage,
    getSuppliersSize: (state) => state.suppliersSize,
    getSuppliersTotalElements: (state) => state.suppliersTotalElements,
    getSuppliersTotalPages: (state) => state.suppliersTotalPages,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};


