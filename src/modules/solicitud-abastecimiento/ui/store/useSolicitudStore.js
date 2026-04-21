import { defineStore } from 'pinia';
import { CreateSolicitud } from '../../application/CreateSolicitud';
import { GetSolicitudes } from '../../application/GetSolicitudes';
import { SolicitudHttpRepository } from '../../infrastructure/SolicitudHttpRepository';

export const useSolicitudStore = defineStore('solicitudAbastecimiento', {
  state: () => ({
    solicitud: {
      subdireccion: '',
      descripcionNecesidad: '',
      proyectos: [],
      presupuestoDisponible: 0,
      nivelAprobacion: '',
      observacionesProductos: '',
      departamento: '',
      municipio: '',
      direccion: '',
      contacto: '',
      telefono: '',
      fechaEntrega: '',
      requiereFlete: false,
      garantias: '',
    },
    solicitudes: [],
    loading: false,
    error: null
  }),
  actions: {
    async submit() {
      // Hexagonal Architecture Application Layer Instance
      const repository = new SolicitudHttpRepository();
      const createSolicitudUseCase = new CreateSolicitud(repository);

      this.loading = true;
      this.error = null;
      try {
        await createSolicitudUseCase.execute(this.solicitud);
        alert('¡Orden creada de manera exitosa!');
      } catch (e) {
        this.error = e.message;
        alert(`Error: ${e.message}`);
      } finally {
        this.loading = false;
      }
    },
    async fetchSolicitudes() {
      const repository = new SolicitudHttpRepository();
      const getSolicitudesUseCase = new GetSolicitudes(repository);
      
      this.loading = true;
      this.error = null;
      try {
        this.solicitudes = await getSolicitudesUseCase.execute();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async approveSolicitud(id, encargados) {
      const repository = new SolicitudHttpRepository();
      this.loading = true;
      try {
        await repository.aprobar(id, encargados);
        await this.fetchSolicitudes();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async rejectSolicitud(id) {
      const repository = new SolicitudHttpRepository();
      this.loading = true;
      try {
        await repository.rechazar(id);
        await this.fetchSolicitudes();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async returnSolicitud(id, nota) {
      const repository = new SolicitudHttpRepository();
      this.loading = true;
      try {
        await repository.devolver(id, nota);
        await this.fetchSolicitudes();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteSolicitud(id) {
      const repository = new SolicitudHttpRepository();
      this.loading = true;
      try {
        await repository.eliminar(id);
        await this.fetchSolicitudes();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async updateSolicitud(solicitud) {
      const repository = new SolicitudHttpRepository();
      this.loading = true;
      try {
        const result = await repository.actualizar(solicitud.id, solicitud);
        await this.fetchSolicitudes();
        return result;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    }
  }
});
