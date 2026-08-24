import axios from 'axios';
import { URL_API } from '../../../utils/config';
import { IRequisicionRepository } from '../domain/IRequisicionRepository';

export class RequisicionHttpRepository extends IRequisicionRepository {
  
  constructor() {
    super();
    this.BASE_URL = `${URL_API}/api/v1/requisiciones`;
  }

  async crear(requisicion) {
    try {
      const response = await axios.post(this.BASE_URL, requisicion);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async obtenerTodas(filters) {
    try {
      const params = {};
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.search) params.search = filters.search;
        if (filters.fechaSolicitud) params.fechaSolicitud = filters.fechaSolicitud;
      }
      const response = await axios.get(this.BASE_URL, { params });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async obtenerPorId(id) {
    try {
      const response = await axios.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async actualizar(id, requisicion) {
    try {
      const response = await axios.patch(`${this.BASE_URL}/${id}`, requisicion);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async reemplazarItems(id, items) {
    try {
      const response = await axios.patch(`${this.BASE_URL}/${id}/items`, items);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async actualizarStatus(id, status) {
    try {
      const response = await axios.patch(`${this.BASE_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async eliminar(id) {
    try {
      await axios.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      this._handleError(error);
    }
  }

  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 422) {
        throw { code: 422, data: error.response.data.error || error.response.data };
      }
      throw new Error(error.response.data.message || 'Error del servidor');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
}
