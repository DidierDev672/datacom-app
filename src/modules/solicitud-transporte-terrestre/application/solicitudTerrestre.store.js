import { defineStore } from 'pinia';
import { solicitudTerrestreApi } from '../../../api/solicitudTerrestre.api';

export const useSolicitudTerrestreStore = defineStore('solicitudTerrestre', {
  state: () => ({
    solicitudes: [],
    solicitudActual: {
      codigo: '',
      fecha: new Date().toISOString().substring(0, 10),
      proyecto: '',
      area: '',
      solicitante: '',
      servicio: {
        tipoServicio: 'IDA',
        tipoVehiculo: 'AUTOMOVIL'
      },
      transporte: {
        origen: '',
        destino: '',
        fechaHoraSalida: '',
        fechaHoraRegreso: null
      },
      pasajeros: [],
      justificacion: {
        motivoTraslado: '',
        relacionProyecto: ''
      },
      aprobaciones: {
        jefeInmediato: '',
        areaAdministrativa: ''
      }
    },
    isLoading: false,
    error: null,
    pasoActual: 1
  }),

  actions: {
    async fetchAll(filters = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            cleanFilters[key] = filters[key];
          }
        });
        const response = await solicitudTerrestreApi.fetchAll(cleanFilters);
        this.solicitudes = response.data;
      } catch (err) {
        this.error = 'No se pudo conectar con el servidor. Intenta de nuevo.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await solicitudTerrestreApi.fetchById(id);
        this.solicitudActual = response.data;
      } catch (err) {
        this.error = 'Error al obtener la solicitud';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async create(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await solicitudTerrestreApi.create(payload);
        this.solicitudes.push(response.data);
        return response.data;
      } catch (err) {
        this.error = (err.response && err.response.data && err.response.data.error && err.response.data.error.message) 
          ? err.response.data.error.message 
          : 'Error al crear la solicitud';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async update(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await solicitudTerrestreApi.update(id, payload);
        const index = this.solicitudes.findIndex(s => s.idSolicitud === id);
        if (index !== -1) {
          this.solicitudes[index] = response.data;
        }
        return response.data;
      } catch (err) {
        this.error = (err.response && err.response.data && err.response.data.error && err.response.data.error.message) 
          ? err.response.data.error.message 
          : 'Error al actualizar la solicitud';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(id, status) {
        this.isLoading = true;
        try {
          const response = await solicitudTerrestreApi.updateStatus(id, status);
          const index = this.solicitudes.findIndex(s => s.idSolicitud === id);
          if (index !== -1) {
            this.solicitudes[index] = response.data;
          }
          return response.data;
        } catch (err) {
          this.error = 'Error al actualizar el estado';
          throw err;
        } finally {
          this.isLoading = false;
        }
    },

    async deleteSolicitud(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await solicitudTerrestreApi.delete(id);
        this.solicitudes = this.solicitudes.filter(s => s.idSolicitud !== id);
      } catch (err) {
        this.error = 'Error al eliminar la solicitud';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    setPaso(paso) {
      this.pasoActual = paso;
    },

    resetSolicitudActual() {
      this.pasoActual = 1;
      this.solicitudActual = {
        codigo: '',
        fecha: new Date().toISOString().substring(0, 10),
        proyecto: '',
        area: '',
        solicitante: '',
        servicio: {
          tipoServicio: 'IDA',
          tipoVehiculo: 'AUTOMOVIL'
        },
        transporte: {
          origen: '',
          destino: '',
          fechaHoraSalida: '',
          fechaHoraRegreso: null
        },
        pasajeros: [],
        justificacion: {
          motivoTraslado: '',
          relacionProyecto: ''
        },
        aprobaciones: {
          jefeInmediato: '',
          areaAdministrativa: ''
        }
      };
    }
  }
});
