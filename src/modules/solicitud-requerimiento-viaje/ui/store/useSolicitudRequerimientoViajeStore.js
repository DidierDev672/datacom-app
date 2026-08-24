import { defineStore } from 'pinia';
import {
  listRequerimientoViajes,
  getRequerimientoViajeById,
  createRequerimientoViaje,
  patchRequerimientoViajeEstado
} from '../../api/solicitudRequerimientoViaje.api';

/** Algunos navegadores envían HH:mm:ss para type=time — recorta a longitud válida BD. */
function clipTimeLen (value) {
  if (value === null || value === undefined) return '';
  var s = String(value).trim();
  if (s.length > 16) return s.substring(0, 16);
  return s;
}

function todayYmd () {
  var d = new Date();
  var m = ('0' + (d.getMonth() + 1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);
  return d.getFullYear() + '-' + m + '-' + day;
}

function emptyForm () {
  return {
    fechaSolicitud: todayYmd(),
    nombreEmpleado: '',
    cedula: '',
    correoElectronico: '',
    celular: '',
    motivoViaje: '',
    fechaViajeIda: '',
    fechaRegreso: '',
    lugarRecogida: '',
    horarioSugeridoIda: '07:00',
    rutaIda: '',
    rutaRegreso: '',
    rutaVuelta: '',
    pernoctan: false,
    tipoTransporte: 'TERRESTRE',
    lugarRecogidaRegreso: '',
    horarioSugeridoRegreso: '17:00',
    proyectoCentroCosto: '',
    observaciones: ''
  };
}

export const useSolicitudRequerimientoViajeStore = defineStore('solicitudRequerimientoViaje', {
  state: function () {
    return {
      form: emptyForm(),
      lista: [],
      isLoading: false,
      error: null,
      /** Último código generado por el servidor tras guardar */
      ultimoCodigoGenerado: null,
      ultimoIdCreado: null
    };
  },
  actions: {
    resetForm () {
      this.form = emptyForm();
      this.error = null;
      this.ultimoCodigoGenerado = null;
      this.ultimoIdCreado = null;
    },

    /**
     * Carga listado desde el backend (GET).
     */
    async fetchLista (params) {
      this.isLoading = true;
      this.error = null;
      try {
        this.lista = await listRequerimientoViajes(params);
        return this.lista;
      } catch (e) {
        this.error = (e && e.message) ? e.message : String(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtiene un registro por id (GET).
     * @param {number|string} id
     */
    async fetchById (id) {
      this.isLoading = true;
      this.error = null;
      try {
        var data = await getRequerimientoViajeById(id);
        return data;
      } catch (e) {
        this.error = (e && e.message) ? e.message : String(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Persiste la solicitud. El servidor devuelve `codigo` automático.
     */
    async guardar () {
      this.isLoading = true;
      this.error = null;
      var f = this.form;
      var payload = {
        fechaSolicitud: f.fechaSolicitud,
        nombreEmpleado: f.nombreEmpleado,
        cedula: f.cedula,
        correoElectronico: f.correoElectronico,
        celular: f.celular,
        motivoViaje: f.motivoViaje,
        fechaViajeIda: f.fechaViajeIda,
        fechaRegreso: f.fechaRegreso,
        lugarRecogida: f.lugarRecogida,
        horarioSugeridoIda: clipTimeLen(f.horarioSugeridoIda),
        rutaIda: f.rutaIda,
        rutaRegreso: f.rutaRegreso,
        rutaVuelta: f.rutaVuelta,
        pernoctan: !!f.pernoctan,
        tipoTransporte: f.tipoTransporte,
        lugarRecogidaRegreso: f.lugarRecogidaRegreso,
        horarioSugeridoRegreso: clipTimeLen(f.horarioSugeridoRegreso),
        proyectoCentroCosto: f.proyectoCentroCosto,
        observaciones: f.observaciones || null
      };
      try {
        var data = await createRequerimientoViaje(payload);
        this.ultimoCodigoGenerado = data && data.codigo ? data.codigo : null;
        this.ultimoIdCreado = data && data.id != null ? data.id : null;
        return data;
      } catch (e) {
        this.error = (e && e.message) ? e.message : String(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Actualiza estado (revisión, aprobación, rechazada). PATCH API.
     * @param {number|string} id
     * @param {string} estado REVISION | APROBACION | RECHAZADA
     */
    async actualizarEstado (id, estado) {
      this.isLoading = true;
      this.error = null;
      try {
        var data = await patchRequerimientoViajeEstado(id, { estado: estado });
        var ix = this.lista.findIndex(function (x) {
          return String(x.id) === String(id);
        });
        if (ix !== -1) {
          this.lista.splice(ix, 1, data);
        }
        return data;
      } catch (e) {
        this.error = (e && e.message) ? e.message : String(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
