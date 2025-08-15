import axios from 'axios';
import { URL_API } from "../../utils/config";

export const state = {
    orders: [],
    userOrders: [],
    pendingApprovals: [],
    loading: false,
    error: null,
    approvalLevels: [],
    levelApprovers: [] // Nueva propiedad
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
    SET_PENDING_APPROVALS(state, approvals) {
        state.pendingApprovals = approvals
    },
    SET_APPROVAL_LEVELS(state, levels) {
        state.approvalLevels = levels
    },
    SET_LEVEL_APPROVERS(state, approvers) {
        state.levelApprovers = approvers
    },
    UPDATE_ORDER_STATUS(state, { orderId, status, approverNotes }) {
        // Actualizar en la lista de aprobaciones pendientes
        const approvalIndex = state.pendingApprovals.findIndex(order => order.id === orderId)
        if (approvalIndex !== -1) {
            state.pendingApprovals.splice(approvalIndex, 1)
        }

        // Actualizar en la lista de órdenes del usuario si existe
        const userOrderIndex = state.userOrders.findIndex(order => order.id === orderId)
        if (userOrderIndex !== -1) {
            state.userOrders[userOrderIndex].status = status
            state.userOrders[userOrderIndex].statusDescription = status === 'APPROVED' ? 'Aprobada' : 'Rechazada'
        }
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
            const response = await axios.get(`${URL_API}/api/supply-orders`)
            // Se asume que la API retorna un objeto con results o un array directo
            const orders = response.data && response.data.results ? response.data.results : response.data
            commit('SET_ORDERS', orders || [])
            return orders || []
        } catch (error) {
            console.error('Error al obtener las órdenes:', error)
            throw error
        }
    },

    async fetchApprovedOrders({ dispatch, state }) {
        // Obtiene todas las órdenes y filtra las completamente aprobadas
        const orders = state.orders && state.orders.length > 0 ? state.orders : await dispatch('fetchOrders')
        if (!Array.isArray(orders)) return []
        return orders.filter(order => {
            if (!order) return false
            const approvers = order.approvers || []
            const total = approvers.length
            const approved = approvers.filter(a => a && a.approved === true).length
            return order.status === 'APPROVED' || (total > 0 && approved === total)
        })
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
    },

    async fetchOrderById({ commit }, orderId) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
            const response = await axios.get(`${URL_API}/api/supply-order/${orderId}`)
            return response.data.results
        } catch (error) {
            console.error('Error al obtener la orden:', error)
            commit('SET_ERROR', error.message || 'Error al obtener la orden')
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // 🚀 NUEVAS ACCIONES PARA APROBACIONES
    async fetchPendingApprovals({ commit }, userId) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
            // Usar el endpoint que ya tienes para obtener órdenes pendientes de aprobación
            const response = await axios.get(`${URL_API}/api/supply-order/approver/${userId}`)
            if (response.data && response.data.results) {
                commit('SET_PENDING_APPROVALS', response.data.results)
                return response.data.results
            }
            return []
        } catch (error) {
            console.error('Error al obtener las órdenes pendientes:', error)
            commit('SET_ERROR', error.message || 'Error al obtener las órdenes pendientes')
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    async approveOrderAction({ commit }, { orderId, approverId }) {
        try {
            const response = await axios.post(`${URL_API}/api/supply-order/approve/${orderId}`, {
                approverId: approverId
            })

            commit('UPDATE_ORDER_STATUS', {
                orderId,
                status: 'APPROVED',
                approverNotes: ''
            })

            return response.data
        } catch (error) {
            console.error('Error al aprobar la orden:', error)
            throw error
        }
    },

    async rejectOrderAction({ commit }, { orderId, rejectionReason, approverId }) {
        try {
            const response = await axios.post(`${URL_API}/api/supply-order/reject/${orderId}`, {
                approverId: approverId,
                rejectionReason: rejectionReason
            })

            commit('UPDATE_ORDER_STATUS', {
                orderId,
                status: 'REJECTED',
                approverNotes: rejectionReason
            })

            return response.data
        } catch (error) {
            console.error('Error al rechazar la orden:', error)
            throw error
        }
    },

    async fetchApprovalLevels({ commit }) {
        try {
            const response = await axios.get(`${URL_API}/api/supply-order/approval-config/levels`)
            commit('SET_APPROVAL_LEVELS', response.data.body)
            return response.data.body
        } catch (error) {
            console.error('Error al obtener los niveles de aprobación:', error)
            throw error
        }
    },

    async fetchLevelApprovers({ commit }, { userId, levelCode }) {
        try {
            const response = await axios.get(`${URL_API}/api/supply-order/approval-config/user/${userId}/level/${levelCode}`)
            commit('SET_LEVEL_APPROVERS', response.data.body)
            // Importante: retornar los datos para que el componente pueda usarlos
            return response.data.body
        } catch (error) {
            console.error('Error al obtener los usuarios aprobadores:', error)
            throw error
        }
    },

    // Asignar orden aprobada a un usuario del equipo de abastecimiento
    async assignOrderToUser({ commit }, { orderId, username }) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
            const response = await axios.post(`${URL_API}/api/supply-order/${orderId}/assign`, {
                id: username
            })
            return response.data
        } catch (error) {
            console.error('Error al asignar la orden:', error)
            commit('SET_ERROR', error.message || 'Error al asignar la orden')
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

export const getters = {
    getOrders: state => state.orders,
    getUserOrders: state => state.userOrders,
    getPendingApprovals: state => state.pendingApprovals,
    getLoading: state => state.loading,
    getError: state => state.error,
    getApprovalLevels: state => state.approvalLevels,
    getApprovedOrders: state => state.userOrders.filter(order => order.status === 'APPROVED'),
    getRejectedOrders: state => state.userOrders.filter(order => order.status === 'REJECTED'),
    getInProgressOrders: state => state.userOrders.filter(order => order.status === 'IN_PROGRESS'),
    getPendingApprovalsCount: state => state.pendingApprovals.length,
    getLevelApprovers: state => state.levelApprovers
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} 