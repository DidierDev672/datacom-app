import { defineStore } from 'pinia';
import { cotizacionApi } from '../api/cotizacion.api';

export const useCotizacionStore = defineStore('cotizacion', {
  state: () => ({
    cotizaciones: [],
    cotizacionActual: {
      codigo: '',
      titulo: '',
      fechaCotizacion: new Date().toISOString().substr(0, 10),
      proveedores: [],
      items: [],
      formaPago: 'CONTADO',
      plazoDias: null,
      descripcionPago: null,
      observaciones: ''
    },
    matrizActual: null,
    isLoading: false,
    error: null,
    pasoActual: 1
  }),

  actions: {
    async fetchAll() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await cotizacionApi.getAll();
        var body = res && res.data !== undefined ? res.data : res;
        this.cotizaciones = Array.isArray(body) ? body : [];
      } catch (err) {
        this.error = 'Error al cargar cotizaciones';
        this.cotizaciones = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(id) {
      this.isLoading = true;
      try {
        const res = await cotizacionApi.getById(id);
        this.cotizacionActual = res.data;
      } catch (err) {
        this.error = 'Error al cargar la cotización';
      } finally {
        this.isLoading = false;
      }
    },

    async create(payload) {
      this.isLoading = true;
      try {
        const res = await cotizacionApi.create(payload);
        return res.data;
      } catch (err) {
        this.error = (err.response && err.response.data && err.response.data.error && err.response.data.error.message) || 'Error al crear la cotización';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    setPaso(paso) {
      this.pasoActual = paso;
    }
  }
});
