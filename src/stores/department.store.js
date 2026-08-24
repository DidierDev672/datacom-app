import { defineStore } from 'pinia';
import { departmentApi } from '../api/department.api';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    departments: [],
    currentDepartment: null,
    isLoading: false,
    isSaving: false,
    error: null,
    errors: {}
  }),

  getters: {
    departamentosActivos: (state) => 
      state.departments.filter(d => d.status === 'ACTIVO'),
    
    totalDepartamentos: (state) => state.departments.length,
  },

  actions: {
    async fetchAll(filters) {
      this.isLoading = true;
      this.error = null;
      try {
        this.departments = await departmentApi.getAll(filters);
      } catch (err) {
        this.error = (err && err.message) ? err.message : 'Error al cargar departamentos';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(id) {
      this.isLoading = true;
      try {
        this.currentDepartment = await departmentApi.getById(id);
      } catch (err) {
        this.error = 'No se pudo obtener el departamento';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async create(payload) {
      this.isSaving = true;
      this.errors = {};
      try {
        const created = await departmentApi.create(payload);
        this.departments.unshift(created);
        return created;
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.errors = err.response.data.errors || {};
        } else if (err.response && err.response.status === 409) {
          this.errors = { code: 'El código de departamento ya existe' };
        }
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    async update(id, payload) {
      this.isSaving = true;
      this.errors = {};
      try {
        const updated = await departmentApi.update(id, payload);
        const index = this.departments.findIndex(d => d.id === id);
        if (index !== -1) {
          this.departments[index] = updated;
        }
        return updated;
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.errors = err.response.data.errors || {};
        }
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    async updateStatus(id, status) {
      try {
        await departmentApi.updateStatus(id, status);
        const dep = this.departments.find(d => d.id === id);
        if (dep) dep.status = status;
      } catch (err) {
        throw err;
      }
    },

    async remove(id) {
      try {
        await departmentApi.remove(id);
        this.departments = this.departments.filter(d => d.id !== id);
      } catch (err) {
        throw err;
      }
    }
  }
});
