import client from "../../../api/client";
import { ICompradorRepository } from "../domain/ICompradorRepository";
import { getRawToken } from "../../../utils/authHelper";

/**
 * Adaptador HTTP para el repositorio de Compradores.
 * Implementa el puerto ICompradorRepository usando axios.
 *
 * Arquitectura Hexagonal: esta clase vive en la capa de Infraestructura.
 * Si la API cambia, solo se modifica este adaptador; los casos de uso no se tocan.
 */
export class CompradorHttpRepository extends ICompradorRepository {
  constructor() {
    super();
    this.baseUrl = "/api/purchasers";
  }

  async crear(comprador) {
    var endpoint = this.baseUrl;

    try {
      var rawToken = getRawToken();
      console.log(
        "%c[CompradorRepo] POST " + endpoint,
        "color: #2196F3; font-weight: bold"
      );
      console.log(
        "%c[Payload]",
        "color: #FF9800",
        JSON.parse(JSON.stringify(comprador))
      );
      console.log(
        "%c[Token]",
        "color: #FF9800",
        rawToken ? rawToken.substring(0, 40) + "..." : "NULL"
      );
      console.log(
        "%c[Token longitud]",
        "color: #FF9800",
        rawToken ? rawToken.length : 0
      );
      console.log(
        "%c[Config base URL]",
        "color: #FF9800",
        client.defaults.baseURL
      );

      var response = await client.post(endpoint, comprador);

      console.log(
        "%c[CompradorRepo] Respuesta OK:",
        "color: #4CAF50; font-weight: bold",
        response.status,
        response.data
      );

      return response.data;
    } catch (err) {
      console.error(
        "%c[CompradorRepo] ERROR en POST " + endpoint,
        "color: #F44336; font-weight: bold"
      );

      if (err && err.response) {
        console.error(
          "%c[Status]",
          "color: #F44336",
          err.response.status,
          err.response.statusText
        );
        console.error(
          "%c[Headers]",
          "color: #F44336",
          JSON.parse(JSON.stringify(err.response.headers || {}))
        );
        console.error("%c[Response Data]", "color: #F44336", err.response.data);
        console.error(
          "%c[Config URL]",
          "color: #F44336",
          err.config && err.config.url
        );
        console.error(
          "%c[Request Headers]",
          "color: #F44336",
          err.config && err.config.headers
            ? JSON.parse(JSON.stringify(err.config.headers))
            : "N/A"
        );
      } else if (err && err.request) {
        console.error(
          "%c[Sin respuesta del servidor]",
          "color: #F44336",
          err.request
        );
      } else {
        console.error(
          "%c[Error de configuracion]",
          "color: #F44336",
          err.message || err
        );
      }

      console.error("%c[Error completo]", "color: #F44336", err);

      throw err;
    }
  }

  async obtenerTodos() {
    var response = await client.get(this.baseUrl);
    return response.data;
  }

  async obtenerPorId(id) {
    var response = await client.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async actualizar(id, comprador) {
    var response = await client.put(`${this.baseUrl}/${id}`, comprador);
    return response.data;
  }

  async eliminar(id) {
    await client.delete(`${this.baseUrl}/${id}`);
  }
}
