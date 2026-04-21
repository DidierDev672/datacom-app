import { defineStore } from 'pinia'
import { PuestoTrabajoRepositoryHttp } from '../modules/talento-humano/infrastructure/PuestoTrabajoRepositoryHttp'

const repository = new PuestoTrabajoRepositoryHttp()

export const usePuestosTrabajoStore = defineStore('puestosTrabajo', {
    state: () => ({
        puestos: [],
        puesto: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchPuestos() {
            this.loading = true
            this.error = null
            try {
                this.puestos = await repository.getAll()
            } catch (err) {
                this.error = 'Error al cargar los puestos de trabajo'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchPuestoById(id) {
            this.loading = true
            this.error = null
            try {
                this.puesto = await repository.getById(id)
            } catch (err) {
                this.error = 'Error al cargar el puesto de trabajo'
                throw err
            } finally {
                this.loading = false
            }
        },

        async savePuesto(puestoData) {
            this.loading = true
            this.error = null
            try {
                if (puestoData.id) {
                    await repository.update(puestoData.id, puestoData)
                } else {
                    await repository.create(puestoData)
                }
                await this.fetchPuestos()
            } catch (err) {
                this.error = 'Error al guardar el puesto de trabajo'
                throw err
            } finally {
                this.loading = false
            }
        },

        async deletePuesto(id) {
            this.loading = true
            this.error = null
            try {
                await repository.delete(id)
                await this.fetchPuestos()
            } catch (err) {
                this.error = 'Error al eliminar el puesto de trabajo'
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
