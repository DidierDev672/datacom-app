/**
 * @interface ISupplyPlanRepository
 * Interfaz/Puerto de dominio para interactuar con los datos del Plan de Abastecimiento.
 * Al usar JavaScript no usamos 'interface' real, pero documentamos los métodos 
 * que cualquier adaptador que lo implemente debe cumplir.
 */

export class ISupplyPlanRepository {
    /**
     * Obtiene todos los planes
     * @returns {Promise<Array>} Lista de planes
     */
    async getAll() {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }

    /**
     * Obtiene un plan por su ID
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    async getById(id) {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }

    /**
     * Crea un nuevo plan
     * @param {Object} supplyPlan 
     * @returns {Promise<Object>}
     */
    async create(supplyPlan) {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }

    /**
     * Actualiza un plan existente
     * @param {string} id 
     * @param {Object} supplyPlan 
     * @returns {Promise<Object>}
     */
    async update(id, supplyPlan) {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }

    /**
     * Elimina lógicamente un plan
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async delete(id) {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }
}
