/**
 * Caso de uso: Listar compradores.
 * Coordina la obtencion de la lista desde el repositorio.
 * Capa de Aplicacion - Arquitectura Hexagonal.
 */
export class ListarCompradoresUseCase {
  constructor(compradorRepository) {
    this.compradorRepository = compradorRepository;
  }

  async execute() {
    return this.compradorRepository.obtenerTodos();
  }
}
