import { defineStore } from 'pinia'
import axios from 'axios'

const URL_API = 'http://localhost:28181'

export const useApprovalConfigStore = defineStore('approvalConfig', {
    state: () => ({
        approvalLevels: [],
        userApprovalLevel: null,
        isLoading: false,
        errors: {},
        config: null
    }),

    getters: {
        getApprovalLevels: (state) => state.approvalLevels,
        getUserApprovalLevel: (state) => state.userApprovalLevel,
        getIsLoading: (state) => state.isLoading,
        getErrors: (state) => state.errors,
        getConfig: (state) => state.config
    },

    actions: {
        //? Obtener configuración de aprobación por usuario
        async fetchUserApprovalConfig(username) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/approval-config/user/${username}`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.config = response.data
                this.userApprovalLevel = response.data.approvalLevel
                
                return response.data
            } catch (error) {
                console.error('Error al obtener configuración de aprobación:', error)
                this.errors.general = 'Error al cargar la configuración de aprobación'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Obtener todos los niveles de aprobación disponibles
        async fetchApprovalLevels() {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = 'api/supply-order/approval-config/levels'
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

        //? Obtener nivel de aprobación por username
        async fetchUserApprovalLevel(username) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = `api/supply-order/approval-config/user/${username}/level`
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`
                    }
                })

                this.userApprovalLevel = response.data
                
                return response.data
            } catch (error) {
                console.error('Error al obtener nivel de aprobación:', error)
                this.errors.general = 'Error al cargar el nivel de aprobación'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        //? Actualizar configuración de aprobación
        async updateApprovalConfig(configData) {
            this.isLoading = true
            this.errors = {}

            try {
                const urlService = 'api/supply-order/approval-config'
                const token = localStorage.getItem('token') || localStorage.getItem('token')
                
                const response = await axios.put(`${URL_API}/${urlService}`, configData, {
                    headers: {
                        'Authorization': `Bearer ${this.convertirStringEnObjeto(token).token}`,
                        'Content-Type': 'application/json'
                    }
                })

                this.config = response.data
                
                return response.data
            } catch (error) {
                console.error('Error al actualizar configuración de aprobación:', error)
                this.errors.general = 'Error al actualizar la configuración de aprobación'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        // Resetear estado
        resetApprovalConfig() {
            this.approvalLevels = []
            this.userApprovalLevel = null
            this.config = null
            this.errors = {}
            this.isLoading = false
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
