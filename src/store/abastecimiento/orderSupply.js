import axios from 'axios';
import { URL_API } from "../../utils/config";
  
export const state = {
    orders: []
}

export const mutations = {
    SET_ORDERS(state, orders) {
        state.orders = orders
    },
    ADD_ORDER(state, order) {
        state.orders.unshift(order)
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
    }
}

export const getters = {
    getOrders: state => state.orders
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} 