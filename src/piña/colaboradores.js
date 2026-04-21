import { defineStore } from 'pinia'
import axios from 'axios'

const URL_API = 'http://localhost:3310'

export const useColaboradoresStore = defineStore('colaboradores', {
    state: () => ({
        colaboradores: [],
        isLoading: false,
        errors: {}
    }),

    getters: {
        getColaboradores: (state) => state.colaboradores,
        getColaboradoresOptions: (state) => {
            return state.colaboradores.map(c => ({
                label: c.nombreCompleto,
                value: c.id,
                email: c.correoElectronico
            }))
        }
    },

    actions: {
        async fetchColaboradores() {
            this.isLoading = true
            this.errors = {}
            try {
                const urlService = 'api/v1/colaboradores'
                const tokenStr = localStorage.getItem('token')
                let token = ''
                
                if (tokenStr) {
                    try {
                        const tokenObj = JSON.parse(tokenStr)
                        token = tokenObj.token || tokenStr
                    } catch (e) {
                        token = tokenStr
                    }
                }

                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                this.colaboradores = response.data
                return response.data
            } catch (error) {
                console.error('Error al obtener colaboradores:', error)
                this.errors.general = 'Error al cargar los colaboradores'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async saveColaborador(payload) {
            this.isLoading = true
            this.errors = {}
            try {
                const urlService = 'api/v1/colaboradores/registro'
                const tokenStr = localStorage.getItem('token')
                let token = ''
                
                if (tokenStr) {
                    try {
                        const tokenObj = JSON.parse(tokenStr)
                        token = tokenObj.token || tokenStr
                    } catch (e) {
                        token = tokenStr
                    }
                }

                const response = await axios.post(`${URL_API}/${urlService}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                this.colaboradores.push(response.data)
                return response.data
            } catch (error) {
                console.error('Error al guardar colaborador:', error)
                this.errors.general = (error.response && error.response.data && error.response.data.message) || 'Error al guardar el colaborador'
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})
