export class CreateRequisicion {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(requisicion) {
    requisicion.validarIdentificacion();
    requisicion.validarItems();
    requisicion.validarJustificacion();

    return this.repository.crear(requisicion);
  }
}
