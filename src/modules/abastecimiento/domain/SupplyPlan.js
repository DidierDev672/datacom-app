/**
 * @class SupplyPlan
 * Entidad de Dominio que representa un Plan de Abastecimiento.
 */
export class SupplyPlan {
    constructor({
        id = null,
        name = '',
        description = '',
        ownerId = null,
        year = new Date().getFullYear(),
        startDate = null,
        endDate = null,
        status = 'pending',
        active = true,
        items = [],
        createdAt = null,
        createdBy = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.year = year;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.active = active;
        this.items = items;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    // Regla de negocio básica: la fecha final no puede ser menor a la inicial
    isValidDateRange() {
        if (!this.startDate || !this.endDate) return false;
        return new Date(this.endDate) >= new Date(this.startDate);
    }
}
