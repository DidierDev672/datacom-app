import client from '../../../api/client';
import { URL_API } from '../../../utils/config';
import { ISupplyPlanRepository } from '../domain/ISupplyPlanRepository';

/**
 * Adaptador de Infraestructura para el API HTTP.
 * Implementa el puerto ISupplyPlanRepository definido en el domino.
 */
export class SupplyPlanRepositoryHttp extends ISupplyPlanRepository {

    constructor() {
        super();
        this.BASE_URL = `${URL_API}/api/v1/supply-plans`;
    }

    async getAll() {
        const response = await client.get(this.BASE_URL);
        return response.data;
    }

    async getById(id) {
        const response = await client.get(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    async create(supplyPlan) {
        const response = await client.post(this.BASE_URL, supplyPlan);
        return response.data;
    }

    async update(id, supplyPlan) {
        const response = await client.put(`${this.BASE_URL}/${id}`, supplyPlan);
        return response.data;
    }

    async updateStatus(id, status) {
        const response = await client.patch(`${this.BASE_URL}/${id}/status`, { status });
        return response.data;
    }

    async delete(id) {
        const response = await client.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }
}
