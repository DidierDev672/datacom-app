import { defineStore } from "pinia";
import { ListarCompradoresUseCase } from "../../application/ListarCompradoresUseCase";
import { CompradorHttpRepository } from "../../infrastructure/CompradorHttpRepository";

var compradorRepository = new CompradorHttpRepository();
var listarCompradoresUseCase = new ListarCompradoresUseCase(
  compradorRepository
);

/**
 * Store Pinia para el listado de compradores.
 * Capa de UI - Arquitectura Hexagonal.
 */
export const useCompradorListStore = defineStore("compradorList", {
  state: function () {
    return {
      compradores: [],
      isLoading: false,
      error: null,
    };
  },

  getters: {
    totalCompradores: function (state) {
      return state.compradores.length;
    },
  },

  actions: {
    async cargarCompradores() {
      this.isLoading = true;
      this.error = null;

      try {
        console.log(
          "%c[compradorList.store] GET /api/purchasers",
          "color: #2196F3; font-weight: bold"
        );

        var response = await listarCompradoresUseCase.execute();

        console.log(
          "%c[compradorList.store] Respuesta OK:",
          "color: #4CAF50; font-weight: bold",
          response
        );

        if (response && response.results) {
          this.compradores = response.results;
        } else if (Array.isArray(response)) {
          this.compradores = response;
        } else {
          this.compradores = [];
        }

        return this.compradores;
      } catch (err) {
        console.error(
          "%c[compradorList.store] ERROR en GET /api/v1/compradores",
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
            "%c[Response Data]",
            "color: #F44336",
            err.response.data
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

        var statusCode = err && err.response ? err.response.status : 0;
        var message =
          "No se pudieron cargar los compradores. Intentalo de nuevo.";

        if (err && err.message) {
          message = err.message;
        } else if (err && err.response && err.response.data) {
          var data = err.response.data;
          if (typeof data === "string") {
            message = data;
          } else if (data.message) {
            message = data.message;
          } else if (data.error) {
            message =
              typeof data.error === "string"
                ? data.error
                : data.error.message || message;
          }
        }

        this.error = {
          status: statusCode,
          message: message,
        };

        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
