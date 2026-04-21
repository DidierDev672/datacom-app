import { defineStore } from 'pinia';
import { Requisicion } from '../../domain/Requisicion';
import { CreateRequisicion } from '../../application/CreateRequisicion';
import { GetRequisiciones } from '../../application/GetRequisiciones';
import { RequisicionHttpRepository } from '../../infrastructure/RequisicionHttpRepository';

export const useRequisicionStore = defineStore('requisiciones', {
  state: () => ({
    requisiciones: [],
    currentRequisicion: null,
    isLoading: false,
    error: null,
    fieldErrors: [] // Array of backend validation errors
  }),
  actions: {
    async fetchAll(filters) {
      this.isLoading = true;
      this.error = null;
      try {
        const repo = new RequisicionHttpRepository();
        const usecase = new GetRequisiciones(repo);
        this.requisiciones = await usecase.execute(filters);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const repo = new RequisicionHttpRepository();
        this.currentRequisicion = await repo.obtenerPorId(id);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
    async create(payload) {
      this.isLoading = true;
      this.error = null;
      this.fieldErrors = [];
      try {
        const repo = new RequisicionHttpRepository();
        const usecase = new CreateRequisicion(repo);
        
        // Ensure payload is an instance of Requisicion
        const req = new Requisicion(payload);
        const result = await usecase.execute(req);
        
        this.requisiciones.push(result);
        return result;
      } catch (e) {
        if (e.code === 422) {
           this.error = e.data.message || 'Error de validación en campos enviados.';
           this.fieldErrors = e.data.fieldErrors || [];
           throw e; // re-throw to be handled by the UI
        }
        this.error = e.message;
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
    async updateItems(id, items) {
      this.isLoading = true;
      this.error = null;
      try {
        const repo = new RequisicionHttpRepository();
        await repo.reemplazarItems(id, items);
        await this.fetchAll();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
    async updateStatus(id, status) {
      this.isLoading = true;
      this.error = null;
      try {
        const repo = new RequisicionHttpRepository();
        await repo.actualizarStatus(id, status);
        await this.fetchAll();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
