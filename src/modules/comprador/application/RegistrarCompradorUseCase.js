/**
 * Caso de uso: Registrar un nuevo comprador.
 * Coordina la validacion del dominio con la persistencia del repositorio.
 * Capa de Aplicacion - Arquitectura Hexagonal.
 */
export class RegistrarCompradorUseCase {
  constructor(compradorRepository) {
    this.compradorRepository = compradorRepository;
  }

  async execute(comprador) {
    comprador.validar();
    const payload = comprador.toJSON();
    return this.compradorRepository.crear(payload);
  }
}
