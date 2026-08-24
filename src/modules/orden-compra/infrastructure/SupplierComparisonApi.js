import client from "src/api/client";

const BASE_URL = "/api/supplier-comparisons";

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
    if (responseData.body && responseData.body.message) {
      return responseData.body.message;
    }
  }

  if (error.message) return error.message;
  return fallback;
}

function normalizeComparisonId(id) {
  const value = id == null ? "" : String(id).trim();
  if (!value) {
    throw new Error("No se pudo identificar la comparación a eliminar.");
  }
  return encodeURIComponent(value);
}

function comparisonPath(id) {
  return `${BASE_URL}/${normalizeComparisonId(id)}`;
}

export const supplierComparisonApi = {
  async listComparisons() {
    try {
      const response = await client.get(`${BASE_URL}/`);
      const data = toResponseData(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw new Error(
        extractApiError(error, "No fue posible cargar las comparaciones.")
      );
    }
  },

  async getComparison(id) {
    try {
      const response = await client.get(comparisonPath(id));
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se encontró la comparación solicitada.")
      );
    }
  },

  async createComparison(payload) {
    try {
      const response = await client.post(`${BASE_URL}/`, payload);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No fue posible registrar la comparación.")
      );
    }
  },

  async updateComparison(id, payload) {
    try {
      const response = await client.put(comparisonPath(id), payload);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No fue posible actualizar la comparación.")
      );
    }
  },

  async deleteComparison(id) {
    try {
      await client.delete(comparisonPath(id));
      return true;
    } catch (error) {
      const status =
        error && error.response ? error.response.status : undefined;
      const message =
        typeof error === "string"
          ? error
          : extractApiError(error, "No fue posible eliminar la comparación.");

      if (status === 404) {
        return false;
      }
      if (
        status === 405 ||
        /not supported/i.test(message) ||
        /method not allowed/i.test(message)
      ) {
        throw new Error(
          "El servidor no acepta DELETE en esta ruta. Reinicia el backend y confirma que la URL incluya el id de la comparación."
        );
      }
      throw new Error(message);
    }
  },
};
