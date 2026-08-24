import { defineStore } from 'pinia'
import client from 'src/api/client'

export const useColaboradorRutasStore = defineStore('colaboradorRutas', {
  state: () => ({
    rutas: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    rutaDisponibles: (state) => {
      return state.rutas.map(function (r) {
        return { id: r.id, rutaPath: r.rutaPath, rutaNombre: r.rutaNombre }
      })
    },
  },

  actions: {
    async fetchRutas(colaboradorId) {
      if (!colaboradorId) return
      this.isLoading = true
      this.error = null
      try {
        var response = await client.get('/api/v1/colaborador-rutas/' + colaboradorId)
        this.rutas = response.data && response.data.rutas ? response.data.rutas : []
      } catch (err) {
        this.error = err.message || 'Error al cargar rutas'
        this.rutas = []
      } finally {
        this.isLoading = false
      }
    },

    reset() {
      this.rutas = []
      this.isLoading = false
      this.error = null
    },
  },
})
