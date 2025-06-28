import axios from 'axios';
import { URL_API } from "../../utils/config";
  
export const state = {
    orders: [],
    userOrders: [],
    loading: false,
    error: null
}

export const mutations = {
    SET_ORDERS(state, orders) {
        state.orders = orders
    },
    ADD_ORDER(state, order) {
        state.orders.unshift(order)
    },
    SET_USER_ORDERS(state, orders) {
        state.userOrders = orders
    },
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    SET_ERROR(state, error) {
        state.error = error
    }
}

export const actions = {
    async createOrder({ commit }, orderData) {
        try {
            const response = await axios.put(`${URL_API}/api/supply-order/${orderData.id}`, orderData)
            commit('ADD_ORDER', response.data)
            return response.data
        } catch (error) {
            console.error('Error al crear la orden:', error)
            throw error
        }
    },
    async fetchOrders({ commit }) {
        try {
            const response = await axios.get('/api/supply-orders')
            commit('SET_ORDERS', response.data)
            return response.data
        } catch (error) {
            console.error('Error al obtener las órdenes:', error)
            throw error
        }
    },
    async fetchUserOrders({ commit }, userId) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
            const response = await axios.get(`${URL_API}/api/supply-order/owner/${userId}`)
            if (response.data && response.data.results) {
                commit('SET_USER_ORDERS', response.data.results)
                return response.data.results
            }
            return []
        } catch (error) {
            console.error('Error al obtener las órdenes del usuario:', error)
            commit('SET_ERROR', error.message || 'Error al obtener las órdenes')
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

export const getters = {
    getOrders: state => state.orders,
    getUserOrders: state => state.userOrders,
    getLoading: state => state.loading,
    getError: state => state.error,
    getApprovedOrders: state => state.userOrders.filter(order => order.status === 'APPROVED'),
    getRejectedOrders: state => state.userOrders.filter(order => order.status === 'REJECTED'),
    getInProgressOrders: state => state.userOrders.filter(order => order.status === 'IN_PROGRESS')
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} 