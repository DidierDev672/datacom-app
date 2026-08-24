import axios from 'axios';
import { URL_API } from '../../../utils/config';
import { ISolicitudRepository } from '../domain/ISolicitudRepository';
import { toSolicitudPayload } from './solicitudPayload';

/**
 * Adapter that implements the ISolicitudRepository interface.
 * Realiza el llamado HTTP/API al backend de solicitudes.
 */
function extractApiError(error, fallbackMessage) {
  const fallback = fallbackMessage || 'No se pudo registrar la orden.';
  if (!error) return fallback;

  const responseData = error.response && error.response.data;
  if (responseData) {
    if (typeof responseData === 'string') return responseData;
    if (responseData.message && responseData.message !== 'Internal Server Error') {
      return responseData.message;
    }
    if (responseData.error) {
      if (typeof responseData.error === 'string') return responseData.error;
      if (Array.isArray(responseData.error.fieldErrors) && responseData.error.fieldErrors.length) {
        return responseData.error.fieldErrors
          .map((fieldError) => fieldError.message)
          .filter(Boolean)
          .join(' ');
      }
      if (responseData.error.message) return responseData.error.message;
    }
    if (responseData.message) return responseData.message;
  }

  if (error.message) return error.message;
  return fallback;
}

export class SolicitudHttpRepository extends ISolicitudRepository {
  
  constructor() {
    super();
    this.BASE_URL = `${URL_API}/api/v1/solicitudes-plan-abastecimiento`;
  }

  async crearSolicitud(solicitud) {
    try {
      const payload = toSolicitudPayload(solicitud);
      const response = await axios.post(this.BASE_URL, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        extractApiError(error, 'No se pudo registrar la orden de abastecimiento.')
      );
    }
  }

  async obtenerTodas() {
    try {
      const response = await axios.get(this.BASE_URL);
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (data && Array.isArray(data.results)) {
        return data.results;
      }

      return [];
    } catch (error) {
      throw new Error(
        extractApiError(error, 'No se pudieron cargar las solicitudes de abastecimiento.')
      );
    }
  }

  async obtenerPorId(id) {
    if (!id) {
      return null;
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/${id}`);
      const data = response.data;
      if (data && data.results !== undefined) {
        return data.results;
      }
      return data;
    } catch (error) {
      throw new Error(
        extractApiError(error, 'No se pudo cargar el detalle de la solicitud.')
      );
    }
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
    try {
      const payload = toSolicitudPayload(solicitud, { includeId: true });
      const response = await axios.put(`${this.BASE_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        extractApiError(error, 'No se pudo actualizar la solicitud de abastecimiento.')
      );
    }
  }

  async actualizarNombreOrden(id, nombreOrden) {
    try {
      const response = await axios.patch(`${this.BASE_URL}/${id}/nombre-orden`, {
        nombreOrden: (nombreOrden || '').trim(),
      });
      return response.data;
    } catch (error) {
      throw new Error(
        extractApiError(error, 'No se pudo actualizar el nombre de la orden.')
      );
    }
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
