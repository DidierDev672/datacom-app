import { SupplyPlan } from '../domain/SupplyPlan';

export class CreateSupplyPlan {
    /**
     * @param {import('../domain/ISupplyPlanRepository').ISupplyPlanRepository} repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    async execute(supplyPlanDTO) {
        // Validación de negocio (Primera y Tercera ley: Validar datos para evitar daños/corrupción)
        const plan = new SupplyPlan(supplyPlanDTO);

        if (!plan.name) {
            throw new Error("El nombre del plan es obligatorio.");
        }

        if (!plan.isValidDateRange()) {
            throw new Error("La fecha final debe ser posterior a la fecha de inicio.");
        }

        // Llamada al puerto/repositorio
        return await this.repository.create(plan);
    }
}
