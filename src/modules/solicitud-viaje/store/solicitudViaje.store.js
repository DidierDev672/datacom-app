import { defineStore } from 'pinia';
import { solicitudViajeApi } from '../api/solicitudViaje.api';

export const useSolicitudViajeStore = defineStore('solicitudViaje', {
  state: () => ({
    currentStep: 1,
    form: {
      codigo: '',
      fechaSolicitud: new Date().toISOString().substr(0, 10),
      proyecto: '',
      area: '',
      solicitanteNombre: '',
      tipoSolicitud: 'AMBOS',
      transporte: {
        origen: '',
        destino: '',
        fechaSalida: '',
        fechaRegreso: '',
        tipoTransporte: '',
        numeroPersonas: 1
      },
      hospedaje: {
        ciudad: '',
        hotel: '',
        fechaIngreso: '',
        fechaSalida: '',
        numeroHabitaciones: 1,
        numeroPersonas: 1
      },
      personas: [],
      motivoViaje: '',
      relacionProyecto: ''
    },
    solicitudes: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchSolicitudes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await solicitudViajeApi.getAll();
        this.solicitudes = response.data;
        return response.data;
      } catch (err) {
        this.error = err.message || 'Error al obtener las solicitudes';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async updateSolicitud(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await solicitudViajeApi.update(id, data);
        const index = this.solicitudes.findIndex(s => s.id === id);
        if (index !== -1) {
          this.solicitudes.splice(index, 1, response.data);
        }
        return response.data;
      } catch (err) {
        this.error = err.message || 'Error al actualizar la solicitud';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createSolicitud() {
      this.loading = true;
      this.error = null;
      try {
        const response = await solicitudViajeApi.create(this.form);
        this.solicitudes.push(response.data);
        return response.data;
      } catch (err) {
        this.error = err.message || 'Error al crear la solicitud';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    setStep(step) {
      this.currentStep = step;
    },

    addPersona(persona) {
      this.form.personas.push({ ...persona });
    },

    removePersona(index) {
      this.form.personas.splice(index, 1);
    },

    resetForm() {
      this.currentStep = 1;
      this.form = {
        codigo: '',
        fechaSolicitud: new Date().toISOString().substr(0, 10),
        proyecto: '',
        area: '',
        solicitanteNombre: '',
        tipoSolicitud: 'AMBOS',
        transporte: {
          origen: '',
          destino: '',
          fechaSalida: '',
          fechaRegreso: '',
          tipoTransporte: '',
          numeroPersonas: 1
        },
        hospedaje: {
          ciudad: '',
          hotel: '',
          fechaIngreso: '',
          fechaSalida: '',
          numeroHabitaciones: 1,
          numeroPersonas: 1
        },
        personas: [],
        motivoViaje: '',
        relacionProyecto: ''
      };
    }
  }
});
