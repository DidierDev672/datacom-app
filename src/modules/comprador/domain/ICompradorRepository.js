/**
 * Puerto de dominio para el repositorio de Compradores.
 * Sigue SOLID — Inversion de Dependencias e Interface Segregation.
 * Ningun caso de uso depende de la implementacion concreta (HTTP, mock, etc.),
 * sino de este contrato, garantizando desacoplamiento total de infraestructura.
 */
export class ICompradorRepository {
  async crear(comprador) {
    throw new Error('ICompradorRepository.crear() no implementado');
  }

  async obtenerTodos() {
    throw new Error('ICompradorRepository.obtenerTodos() no implementado');
  }

  async obtenerPorId(id) {
    throw new Error('ICompradorRepository.obtenerPorId() no implementado');
  }

  async actualizar(id, comprador) {
    throw new Error('ICompradorRepository.actualizar() no implementado');
  }

  async eliminar(id) {
    throw new Error('ICompradorRepository.eliminar() no implementado');
  }
}
