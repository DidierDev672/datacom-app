import { defineStore } from 'pinia';
import axios from 'axios';

export const useTalentoHumanoStore = defineStore('talentoHumano', {
  state: () => ({
    colaborador: {
      // 1. Identificación del cargo
      nombreCargo: '',
      codigoCargo: '',
      areaDepartamento: '',
      nivelJerarquico: '',
      
      // 2. Información Personal
      nombreCompleto: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      genero: '',
      nacionalidad: 'Colombiana',
      
      // 3. Datos de contacto
      telefono: '',
      correoElectronico: '',
      direccionResidencia: '',
      
      // 4. Información Laboral
      cargoAsignado: '',
      fechaIngreso: '',
      tipoContrato: '',
      estado: 'Activo',
      
      // 5. Formación y Experiencia
      nivelEducativo: '',
      profesion: '',
      experienciaLaboral: '',
      urlCertificadoPdf: '',
      
      // 6. Información administrativa
      eps: '',
      fondoPension: '',
      arl: ''
    },
    colaboradores: [],
    loading: false,
    error: null,
    step: 1
  }),
  actions: {
    async registrarColaborador() {
      this.loading = true;
      this.error = null;
      try {
        console.log('📤 Enviando payload al backend:', JSON.stringify(this.colaborador, null, 2));
        const response = await axios.post('/api/v1/colaboradores', this.colaborador);
        console.log('✅ Respuesta del servidor:', response.data);
        this.resetForm();
        return response.data;
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.message) || 'Error al registrar colaborador';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async fetchColaboradores() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/v1/colaboradores');
        this.colaboradores = response.data;
        return response.data;
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.message) || 'Error al obtener la lista de colaboradores';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.$reset();
    }
  }
});
