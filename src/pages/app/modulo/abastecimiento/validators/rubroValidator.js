export class RubroValidator {
  validate(formData) {
    const errors = [];

    if (!formData.nombreRubro?.trim()) {
      errors.push("nombreRubro");
    }

    if (formData.fechaInicio && !this.isValidDate(formData.fechaInicio)) {
      errors.push("fechaInicio");
    }
    if (formData.fechaFinal && !this.isValidDate(formData.fechaFinal)) {
      errors.push("fechaFinal");
    }
    if (formData.valorPresupuesto && isNaN(formData.valorPresupuesto)) {
      errors.push("valorPresupuesto");
    }

    if (errors.length > 0) {
      throw new RubroError("Validation errors", "VALIDATION_ERROR", errors);
    }

    return true;
  }
  validateProps(props) {
    if (
      props.rubroId !== null &&
      typeof props.rubroId !== "string" &&
      typeof props.rubroId !== "number"
    ) {
      throw new RubroError(
        "Rubro ID must be a string or number",
        "INVALID_ID_TYPE"
      );
    }
  }
}
