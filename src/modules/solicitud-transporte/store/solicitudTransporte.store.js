import { defineStore } from 'pinia';
import { solicitudTransporteApi } from '../../../api/solicitudTransporte.api';

export const useSolicitudTransporteStore = defineStore('solicitudTransporte', {
  state: () => ({
    solicitudes: [],
    solicitudActual: {
      codigo: '',
      fecha: new Date().toISOString().substr(0, 10),
      proyecto: '',
      area: '',
      solicitante: '',
      viaje: {
        ciudadOrigen: '',
        ciudadDestino: '',
        fechaSalida: '',
        fechaRegreso: null,
        tipoViaje: 'IDA_Y_VUELTA'
      },
      pasajeros: [],
      preferencias: {
        aerolineaPreferida: null,
        horariosPreferidos: null,
        claseVuelo: 'ECONOMICA'
      },
      justificacion: {
        motivoViaje: '',
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
        const response = await solicitudTransporteApi.fetchAll(filters);
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
        const response = await solicitudTransporteApi.fetchById(id);
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
        const response = await solicitudTransporteApi.create(payload);
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

    setPaso(paso) {
      this.pasoActual = paso;
    },

    resetSolicitudActual() {
      this.pasoActual = 1;
      this.solicitudActual = {
        codigo: '',
        fecha: new Date().toISOString().substr(0, 10),
        proyecto: '',
        area: '',
        solicitante: '',
        viaje: {
          ciudadOrigen: '',
          ciudadDestino: '',
          fechaSalida: '',
          fechaRegreso: null,
          tipoViaje: 'IDA_Y_VUELTA'
        },
        pasajeros: [],
        preferencias: {
          aerolineaPreferida: null,
          horariosPreferidos: null,
          claseVuelo: 'ECONOMICA'
        },
        justificacion: {
          motivoViaje: '',
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
