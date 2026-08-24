/**
 * Entidad de dominio CompradorList.
 * Representa un comprador en el contexto de listado.
 * Capa de Dominio - Arquitectura Hexagonal.
 */
export class CompradorList {
  constructor(init) {
    this.id = null;
    this.comprador = '';
    this.nit = '';
    this.ciudad = '';
    this.despacho = '';
    this.direccion = '';

    if (init) Object.assign(this, init);
  }

  matches(searchTerm) {
    if (!searchTerm) return true;
    var term = searchTerm.toLowerCase().trim();
    return (
      (this.comprador && this.comprador.toLowerCase().indexOf(term) !== -1) ||
      (this.nit && this.nit.toLowerCase().indexOf(term) !== -1) ||
      (this.ciudad && this.ciudad.toLowerCase().indexOf(term) !== -1) ||
      (this.despacho && this.despacho.toLowerCase().indexOf(term) !== -1) ||
      (this.direccion && this.direccion.toLowerCase().indexOf(term) !== -1)
    );
  }
}
