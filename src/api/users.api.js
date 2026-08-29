import axios from "axios";
import { getRawToken } from "../utils/authHelper";

/**
 * usersApi — Acceso al listado de usuarios del sistema.
 * GET /api/v1/users
 *
 * Usa una instancia axios propia (misma baseURL y auth) para poder leer el
 * status HTTP real de la respuesta, en especial el 400, que el interceptor
 * global de `client` transforma y pierde. Así la vista puede reaccionar con
 * mensajes amigables según el código de estado.
 */
const usersClient = axios.create({
  baseURL:
    process.env.VUE_APP_API_BASE_URL != null
      ? process.env.VUE_APP_API_BASE_URL
      : "http://localhost:3310",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

usersClient.interceptors.request.use((config) => {
  let tenant;
  try {
    tenant = JSON.parse(localStorage.getItem("tenant"));
  } catch (e) {
    tenant = localStorage.getItem("tenant");
  }
  if (tenant != null && tenant !== "") {
    config.headers["X-Tenantid"] = tenant;
  }

  const token = getRawToken();
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

/**
 * Obtiene todos los usuarios del sistema.
 * @returns {Promise<{ status: number, data: Array, error: Error|null }>}
 */
export async function getSystemUsers() {
  try {
    const res = await usersClient.get("/api/v1/users");
    return {
      status: res.status,
      data: Array.isArray(res.data) ? res.data : [],
      error: null,
    };
  } catch (err) {
    var status = err && err.response ? err.response.status : null;
    var data = err && err.response ? err.response.data : null;
    return {
      status: status,
      data: data,
      error: err,
    };
  }
}

export const usersApi = {
  getAll: getSystemUsers,
};
