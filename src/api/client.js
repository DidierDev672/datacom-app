import axios from "axios";
import { getRawToken } from "../utils/authHelper";

const client = axios.create({
  baseURL:
    process.env.VUE_APP_API_BASE_URL != null
      ? process.env.VUE_APP_API_BASE_URL
      : "http://localhost:3310",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  let tenant = JSON.parse(localStorage.getItem("tenant"));
  if (tenant) {
    config.headers["X-Tenantid"] = tenant;
  }

  const token = getRawToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        code: "NETWORK_ERROR",
        message: "Sin conexión. Verifica tu red e intenta de nuevo.",
        fieldErrors: [],
      });
    }

    if (
      error.response.status >= 400 &&
      error.response.data &&
      error.response.data.error
    ) {
      return Promise.reject(error.response.data.error);
    }

    return Promise.reject({
      code: "UNKNOWN_ERROR",
      message: error.message || "Ha ocurrido un error inesperado",
      fieldErrors: [],
    });
  }
);

export default client;
