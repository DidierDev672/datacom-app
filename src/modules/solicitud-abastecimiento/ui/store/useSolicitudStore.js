import { defineStore } from 'pinia';
import { CreateSolicitud } from '../../application/CreateSolicitud';
import { GetSolicitudes } from '../../application/GetSolicitudes';
import { SolicitudHttpRepository } from '../../infrastructure/SolicitudHttpRepository';
import { SolicitudAbastecimiento } from '../../domain/Solicitud';

function createEmptySolicitud() {
  return {
    nombreOrden: '',
    subdireccion: '',
    descripcionNecesidad: '',
    proyectos: [],
    presupuestoDisponible: 0,
    presupuestoDisponibleManual: null,
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
    departamentoId: null,
    departamentoNombre: '',
    areaNombre: '',
  };
}

export const useSolicitudStore = defineStore('solicitudAbastecimiento', {
  state: () => ({
    solicitud: createEmptySolicitud(),
    solicitudes: [],
    loading: false,
    error: null
  }),
  actions: {
    resetForm() {
      const defaults = createEmptySolicitud();
      Object.keys(defaults).forEach((key) => {
        this.solicitud[key] = defaults[key];
      });
      this.error = null;
    },
    validateForm() {
      try {
        const solicitud = new SolicitudAbastecimiento(this.solicitud);
        solicitud.validar({ requireOrderName: false });
        this.error = null;
        return true;
      } catch (e) {
        this.error = e.message;
        return false;
      }
    },
    async submit(nombreOrden) {
      const repository = new SolicitudHttpRepository();
      const createSolicitudUseCase = new CreateSolicitud(repository);

      this.loading = true;
      this.error = null;
      this.solicitud.nombreOrden = nombreOrden || '';

      try {
        await createSolicitudUseCase.execute(this.solicitud);
        this.resetForm();
        return { success: true };
      } catch (e) {
        const message = e.message || 'No se pudo registrar la orden.';
        this.error = message;
        return { success: false, message };
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
        const message = e.message || 'No se pudieron cargar las solicitudes de abastecimiento.';
        this.error = message;
        throw new Error(message);
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
      this.error = null;
      try {
        const result = await repository.actualizar(solicitud.id, solicitud);
        await this.fetchSolicitudes();
        return result;
      } catch (e) {
        const message = e.message || 'No se pudo actualizar la solicitud.';
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
    async updateOrderName(id, nombreOrden) {
      const trimmed = (nombreOrden || '').trim();
      if (!trimmed) {
        throw new Error('El nombre de la orden es obligatorio.');
      }
      if (trimmed.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres.');
      }

      const solicitud = this.solicitudes.find((item) => item.id === id);
      if (!solicitud) {
        throw new Error('No se encontró la solicitud seleccionada.');
      }

      const repository = new SolicitudHttpRepository();
      this.loading = true;
      this.error = null;

      try {
        const updated = await repository.actualizarNombreOrden(id, trimmed);
        await this.fetchSolicitudes();
        return updated;
      } catch (e) {
        const message = e.message || 'No se pudo actualizar el nombre de la orden.';
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    }
  }
});
