export class RubroService {
  constructor() {
    // Inversión de dependencias: Depende de una abstracción, no de concreto
    this.rubrosStore = useRubrosStore();
  }

  async fetchRubros(rubroId) {
    if (!rubroId) {
      throw new RubroError("Rubro ID is required", "MISSING_ID");
    }

    const rubro = await this.rubrosStore.getRubroById(rubroId);

    if (!rubro) {
      throw new RubroError("Rubro not found", "NOT_FOUND");
    }

    return this.transformToFormData(rubro);
  }

  transformToFormData(rubro) {
    return Object.freeze({
      nombreRubro: rubro.name || "",
      descripcionRubro: rubro.description || "",
      planAbastecimiento: rubro.planId || null,
      fechaInicio: this.normalizeDate(rubro.startDate),
      fechaFinal: this.normalizeDate(rubro.endDate),
      valorPresupuesto: rubro.totalBudget ?? null,
      activar: typeof rubro.active === "boolean" ? rubro.active : true,
      fechaActivacion: "",
      motivoCambio: "",
    });
  }

  normalizeRubro(dateInput) {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  }
}
