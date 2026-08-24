/**
 * Entidad de dominio Comprador.
 * Define las propiedades del comprador y las reglas de validacion.
 * Capa de Dominio - Arquitectura Hexagonal.
 */
export class Comprador {
  constructor(init) {
    this.id = null;
    this.comprador = '';
    this.nit = '';
    this.ciudad = '';
    this.despacho = '';
    this.direccion = '';

    if (init) Object.assign(this, init);
  }

  validar() {
    const errores = [];

    if (!this.comprador || !this.comprador.trim()) {
      errores.push('El nombre del comprador es obligatorio.');
    }
    if (!this.nit || !this.nit.trim()) {
      errores.push('El NIT es obligatorio.');
    }
    if (!this.ciudad || !this.ciudad.trim()) {
      errores.push('La ciudad es obligatoria.');
    }
    if (!this.despacho || !this.despacho.trim()) {
      errores.push('El despacho es obligatorio.');
    }
    if (!this.direccion || !this.direccion.trim()) {
      errores.push('La direccion es obligatoria.');
    }

    if (errores.length > 0) {
      throw new Error(errores.join(' '));
    }

    return true;
  }

  toJSON() {
    return {
      comprador: (this.comprador || '').trim(),
      nit: (this.nit || '').trim(),
      ciudad: (this.ciudad || '').trim(),
      despacho: (this.despacho || '').trim(),
      direccion: (this.direccion || '').trim()
    };
  }
}
