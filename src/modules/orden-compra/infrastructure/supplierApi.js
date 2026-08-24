import axios from "axios";
import { URL_API } from "src/utils/config";

const BASE_URL = `${URL_API}/api/suppliers`;

function toResponseData(response) {
  if (!response) return null;
  return response.data && response.data.results !== undefined
    ? response.data.results
    : response.data;
}

function extractApiError(error, fallbackMessage) {
  const fallback = fallbackMessage || "Ocurrió un error inesperado.";
  if (!error) return fallback;

  const responseData = error.response && error.response.data;
  if (responseData) {
    if (typeof responseData === "string") return responseData;
    if (responseData.message) return responseData.message;
    if (responseData.error) return responseData.error;
  }

  if (error.message) return error.message;
  return fallback;
}

export const supplierApi = {
  async createSupplier(payload) {
    try {
      const response = await axios.post(`${BASE_URL}/`, payload);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se pudo registrar el proveedor en el sistema.")
      );
    }
  },
};
