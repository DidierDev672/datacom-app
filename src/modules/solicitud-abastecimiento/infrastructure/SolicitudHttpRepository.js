import axios from 'axios';
import { URL_API } from '../../../utils/config';
import { ISolicitudRepository } from '../domain/ISolicitudRepository';

/**
 * Adapter that implements the ISolicitudRepository interface.
 * Realiza el llamado HTTP/API al backend de solicitudes.
 */
export class SolicitudHttpRepository extends ISolicitudRepository {
  
  constructor() {
    super();
    this.BASE_URL = `${URL_API}/api/v1/solicitudes-plan-abastecimiento`;
  }

  async crearSolicitud(solicitud) {
    // Llamado HTTP real al endpoint utilizando conf. global
    const response = await axios.post(this.BASE_URL, solicitud);
    return response.data;
  }

  async obtenerTodas() {
    const response = await axios.get(this.BASE_URL);
    return response.data;
  }

  async aprobar(id, encargados) {
    const response = await axios.put(`${this.BASE_URL}/${id}/aprobar`, { encargados });
    return response.data;
  }

  async rechazar(id) {
    const response = await axios.put(`${this.BASE_URL}/${id}/rechazar`);
    return response.data;
  }

  async devolver(id, nota) {
    const response = await axios.put(`${this.BASE_URL}/${id}/devolver`, { nota });
    return response.data;
  }

  async eliminar(id) {
    const response = await axios.delete(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async actualizar(id, solicitud) {
    const response = await axios.put(`${this.BASE_URL}/${id}`, solicitud);
    return response.data;
  }

  // Mocks extras por si se necesitan llenar combos o datos maestros
  async obtenerPlanesAbastecimiento() {
    return [
      { id: '1', nombre: 'Plan Anual' },
      { id: '2', nombre: 'Plan Extraordinario' }
    ];
  }

  async obtenerNivelesAprobacion() {
    return [
      { id: '1', nombre: 'Nivel Básico' },
      { id: '2', nombre: 'Nivel Gerencial' },
      { id: '3', nombre: 'Nivel Director' }
    ];
  }
}
