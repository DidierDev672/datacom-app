export class GetSupplyPlans {
    /**
     * @param {import('../domain/ISupplyPlanRepository').ISupplyPlanRepository} repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Obtiene todos los planes de abastecimiento
     * @returns {Promise<Array>}
     */
    async execute() {
        return await this.repository.getAll();
    }
}
