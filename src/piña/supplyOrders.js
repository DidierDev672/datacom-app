import { defineStore } from 'pinia'
import axios from 'axios'

const URL_API = 'http://localhost:28181'

export const useSupplyOrdersStore = defineStore('supplyOrders', {
    state: () => ({
        supplyOrders: [],
        currentOrder: null,
        approvalLevels: [],
        levelApprovers: [],
        isLoading: false,
        errors: {},
        pagination: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0
        }
    }),

    getters: {
        getSupplyOrders: (state) => state.supplyOrders,
        getCurrentOrder: (state) => state.currentOrder,
        getApprovalLevels: (state) => state.approvalLevels,
        getLevelApprovers: (state) => state.levelApprovers,
        getIsLoading: (state) => state.isLoading,
        getErrors: (state) => state.errors,
        getPagination: (state) => state.pagination,
        
        // Getters específicos para el componente Abastecimiento.vue
        getNivelOptions: (state) => {
            return state.approvalLevels.map(level => ({
                label: level.description,
                value: level.code
            }))
        }
    },

    actions: {
        //? Obtener todas las órdenes de abastecimiento
        async fetchSupplyOrders(params = {}) {
            this.isLoading = true
            this.errors = {}

            try {
                const { page = 0, size = 10, status, userId } = params
                const urlService = 'api/supply-order'
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    size: size.toString()
                })
                
                if (status) queryParams.append('status', status)
                if (userId) queryParams.append('userId', userId)
                
                const response = await axios.get(`${URL_API}/${urlService}?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.supplyOrders = response.data.content || response.data
                this.pagination = {
                    page: response.data.page || 0,
                    size: response.data.size || 10,
                    totalElements: response.data.totalElements || 0,
                    totalPages: response.data.totalPages || 0
                }
                
                return response.data
            } catch (error) {
                console.error('Error al obtener órdenes de abastecimiento:', error)
                this.errors.general = 'Error al cargar las órdenes de abastecimiento'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Crear una nueva orden de abastecimiento
        async createOrder(orderData) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = 'api/supply-order'
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.post(`${URL_API}/${urlService}`, orderData, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`,
                        'Content-Type': 'application/json'
                    }
                })

                this.supplyOrders.unshift(response.data)
                
                return response.data
            } catch (error) {
                console.error('Error al crear orden de abastecimiento:', error)
                this.errors.general = 'Error al crear la orden de abastecimiento'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Actualizar una orden de abastecimiento existente
        async updateOrder(orderData) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/${orderData.id}`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.put(`${URL_API}/${urlService}`, orderData, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const index = this.supplyOrders.findIndex(order => order.id === orderData.id)
                if (index !== -1) {
                    this.supplyOrders[index] = response.data
                }
                
                return response.data
            } catch (error) {
                console.error('Error al actualizar orden de abastecimiento:', error)
                this.errors.general = 'Error al actualizar la orden de abastecimiento'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Obtener una orden por ID
        async fetchOrderById(orderId) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/${orderId}`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.currentOrder = response.data
                
                return response.data
            } catch (error) {
                console.error('Error al obtener orden por ID:', error)
                this.errors.general = 'Error al cargar la orden'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Obtener niveles de aprobación
        async fetchApprovalLevels() {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = 'api/supply-order/approval-levels'
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.approvalLevels = response.data
                
                return response.data
            } catch (error) {
                console.error('Error al obtener niveles de aprobación:', error)
                this.errors.general = 'Error al cargar los niveles de aprobación'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Obtener aprobadores por nivel
        async fetchLevelApprovers({ userId, levelCode }) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/level-approvers`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    params: {
                        userId,
                        levelCode
                    },
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.levelApprovers = response.data
                
                return response.data
            } catch (error) {
                console.error('Error al obtener aprobadores por nivel:', error)
                this.errors.general = 'Error al cargar los aprobadores'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Eliminar una orden
        async deleteOrder(orderId) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/${orderId}`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                await axios.delete(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.supplyOrders = this.supplyOrders.filter(order => order.id !== orderId)
                
                return true
            } catch (error) {
                console.error('Error al eliminar orden:', error)
                this.errors.general = 'Error al eliminar la orden'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Aprobar orden
        async approveOrder(orderId, approvalData) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/${orderId}/approve`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.post(`${URL_API}/${urlService}`, approvalData, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const index = this.supplyOrders.findIndex(order => order.id === orderId)
                if (index !== -1) {
                    this.supplyOrders[index] = response.data
                }
                
                return response.data
            } catch (error) {
                console.error('Error al aprobar orden:', error)
                this.errors.general = 'Error al aprobar la orden'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Rechazar orden
        async rejectOrder(orderId, rejectionData) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/${orderId}/reject`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.post(`${URL_API}/${urlService}`, rejectionData, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const index = this.supplyOrders.findIndex(order => order.id === orderId)
                if (index !== -1) {
                    this.supplyOrders[index] = response.data
                }
                
                return response.data
            } catch (error) {
                console.error('Error al rechazar orden:', error)
                this.errors.general = 'Error al rechazar la orden'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Resetear estado
        resetSupplyOrders() {
            this.supplyOrders = []
            this.currentOrder = null
            this.approvalLevels = []
            this.levelApprovers = []
            this.errors = {}
            this.pagination = {
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0
            }
        },

        //? Resetear errores
        resetErrors() {
            this.errors = {}
        },

        // Convertir string a objeto (para token)
        convertirStringEnObjeto(token) {
            if (!token) {
                return null;
            }
            try {
                return JSON.parse(token);
            } catch (error) {
                console.error('Error al convertir string a objeto:', error);
                return null;
            }
        }
    }
})
