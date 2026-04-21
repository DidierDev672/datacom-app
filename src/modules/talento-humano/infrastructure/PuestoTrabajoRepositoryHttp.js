import axios from 'axios';
import { IPuestoTrabajoRepository } from '../domain/IPuestoTrabajoRepository';

export class PuestoTrabajoRepositoryHttp extends IPuestoTrabajoRepository {
  constructor() {
    super();
    this.baseUrl = '/api/v1/puestos-trabajo';
  }

  async getAll() {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(puestoTrabajo) {
    const response = await axios.post(this.baseUrl, puestoTrabajo);
    return response.data;
  }

  async update(id, puestoTrabajo) {
    const response = await axios.put(`${this.baseUrl}/${id}`, puestoTrabajo);
    return response.data;
  }

  async delete(id) {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
