import { defineStore } from 'pinia'
import axios from 'axios'
import { URL_API } from '../utils/config'

export const useTercerosStore = defineStore('terceros', {
  state: () => ({
    loading: false,
    terceros: [],
    currentTercero: null,
    error: null
  }),

  actions: {
    async registerTercero(payload) {
      this.loading = true
      this.error = null
      try {
        // El header Authorization global es configurado por el módulo auth de Vuex al hacer login.
        // NO se inyectan headers manuales para evitar sobreescribir el token global con 'Bearer null'.
        console.log('>>> [TercerosStore] Token global:', axios.defaults.headers.common['Authorization'])
        console.log('>>> [TercerosStore] Iniciando registro de tercero:', payload)
        const response = await axios.post(`${URL_API}/api/v1/terceros`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          }
        })
        console.log('<<< [TercerosStore] Respuesta de registro:', response.data)
        if (response.data && response.data.data) {
          this.terceros.push(response.data.data)
          return response.data.data
        }
        return null
      } catch (error) {
        console.log('Error: ' + error);
        console.error('!!! [TercerosStore] Error en registro:', error.response ? error.response.data : error.message)
        this.error = (error.response && error.response.data && error.response.data.message) || 'Error al registrar el tercero'
        throw error
      } finally {
        this.loading = false
      }
    },

    async registerMassiveTerceros(payloadList) {
      this.loading = true
      this.error = null
      try {
        console.log('>>> [TercerosStore] Iniciando registro masivo de:', payloadList.length, 'terceros')
        const response = await axios.post(`${URL_API}/api/v1/terceros`, payloadList)
        console.log('<<< [TercerosStore] Respuesta de registro masivo:', response.data)
        if (response.data && response.data.data) {
          this.terceros = [...this.terceros, ...response.data.data]
          return response.data.data
        }
        return []
      } catch (error) {
        console.error('!!! [TercerosStore] Error en registro masivo:', error.response ? error.response.data : error.message)
        this.error = (error.response && error.response.data && error.response.data.message) || 'Error al registrar terceros masivamente'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTerceros() {
      this.loading = true
      this.error = null
      try {
        // El header Authorization global es configurado por el módulo auth de Vuex al hacer login.
        // NO se inyectan headers manuales para evitar sobreescribir el token global con 'Bearer null'.
        console.log('>>> [TercerosStore] Token global:', axios.defaults.headers.common['Authorization'])
        console.log('>>> [TercerosStore] Obteniendo lista de terceros...')
        const response = await axios.get(`${URL_API}/api/v1/terceros`)
        console.log('<<< [TercerosStore] Respuesta lista de terceros:', response.data)
        if (response.data && response.data.results) {
          this.terceros = response.data.results
          return response.data.results
        }
        return []
      } catch (error) {
        console.error('!!! [TercerosStore] Error al obtener terceros:', error.response ? error.response.data : error.message)
        this.error = 'Error al obtener los terceros'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTercero(id) {
      this.loading = true
      this.error = null
      try {
        // El header Authorization global es configurado por el módulo auth de Vuex al hacer login.
        await axios.delete(`${URL_API}/api/v1/terceros/${id}`)
        this.terceros = this.terceros.filter(t => t.id !== id)
      } catch (error) {
        this.error = 'Error al eliminar el tercero'
        console.error('!!! [TercerosStore] Error al eliminar tercero:', error.response ? error.response.data : error.message)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
