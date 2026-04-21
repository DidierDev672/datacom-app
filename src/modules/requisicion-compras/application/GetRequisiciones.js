export class GetRequisiciones {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(filters) {
    return this.repository.obtenerTodas(filters);
  }
}
