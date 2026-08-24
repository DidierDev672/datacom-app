import { defineStore } from 'pinia';
import proveedorApi from 'src/api/proveedorMaestro.api';

export const useProveedorMaestroStore = defineStore('proveedorMaestro', {
  state: () => ({
    proveedores: [],
    proveedorActual: null,
    isLoading: false,
    error: null
  }),

  getters: {
    proveedoresActivos(state) {
      return state.proveedores.filter(p => p.estado === 'ACTIVO');
    },
    opcionesSelect(state) {
      return state.proveedores
        .filter(p => p.estado === 'ACTIVO')
        .map(p => ({
          label: `${p.nombreRazonSocial} — NIT: ${p.nit}`,
          value: p.idProveedor,
          proveedor: p
        }));
    }
  },

  actions: {
    async fetchAll(filters) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await proveedorApi.getAll(filters || {});
        this.proveedores = res.data;
      } catch (err) {
        this.error = err.message || 'Error al cargar proveedores';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await proveedorApi.getById(id);
        this.proveedorActual = res.data;
        return res.data;
      } catch (err) {
        this.error = err.message || 'Error al cargar proveedor';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async create(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await proveedorApi.create(payload);
        this.proveedores.unshift(res.data);
        return res.data;
      } catch (err) {
        this.error = err.message || 'Error al crear proveedor';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async update(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await proveedorApi.update(id, payload);
        const idx = this.proveedores.findIndex(p => p.idProveedor === id);
        if (idx !== -1) this.proveedores.splice(idx, 1, res.data);
        return res.data;
      } catch (err) {
        this.error = err.message || 'Error al actualizar proveedor';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async toggleEstado(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await proveedorApi.toggleEstado(id);
        const idx = this.proveedores.findIndex(p => p.idProveedor === id);
        if (idx !== -1) this.proveedores.splice(idx, 1, res.data);
        return res.data;
      } catch (err) {
        this.error = err.message || 'Error al cambiar estado';
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
