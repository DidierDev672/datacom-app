import { defineStore } from "pinia";
import client from "src/api/client";
import { getRawToken } from "src/utils/authHelper";

/**
 * Store Pinia para la gestion de compradores.
 * Usa la instancia compartida de axios (client) que inyecta
 * Authorization y X-Tenantid automaticamente via interceptores.
 */
export const useCompradorStore = defineStore("comprador", {
  state: () => ({
    isLoading: false,
    error: null,
  }),

  actions: {
    async registrar(payload) {
      this.isLoading = true;
      this.error = null;

      console.log(
        "%c[comprador.store] registrar",
        "color: #2196F3; font-weight: bold"
      );
      var endpoint = "/api/v1/compradores";

      try {
        var rawToken = getRawToken();

        if (!rawToken) {
          var rawTokenFallback = localStorage.getItem("token");
          if (rawTokenFallback) {
            try {
              var parsed = JSON.parse(rawTokenFallback);
              rawToken =
                parsed && parsed.token ? parsed.token : rawTokenFallback;
            } catch (e) {
              rawToken = rawTokenFallback;
            }
          }
        }

        if (!rawToken) {
          console.error(
            "%c[comprador.store] Sesión expirada — token no encontrado",
            "color: #F44336; font-weight: bold"
          );
          var err = new Error("SESSION_EXPIRED");
          err.code = "SESSION_EXPIRED";
          throw err;
        }

        console.log(
          "%c[comprador.store] POST " + endpoint,
          "color: #2196F3; font-weight: bold"
        );
        console.log(
          "%c[Payload]",
          "color: #FF9800",
          JSON.parse(JSON.stringify(payload))
        );
        console.log(
          "%c[Token]",
          "color: #FF9800",
          rawToken.substring(0, 40) + "..."
        );
        console.log("%c[Token longitud]", "color: #FF9800", rawToken.length);
        console.log(
          "%c[Config base URL]",
          "color: #FF9800",
          client.defaults.baseURL
        );
        console.log(
          "%c[URI]",
          "color: #FF9800",
          client.getUri({ url: endpoint })
        );

        console.log(client.defaults.baseURL);
        var response = await client
          .post(endpoint, payload)
          .then((response) => {
            console.log(response);
            return response;
          })
          .catch((err) => {
            console.log(err);
            return err;
          });

        console.log(
          "%c[comprador.store] Respuesta OK:",
          "color: #4CAF50; font-weight: bold",
          response.status,
          response.data
        );

        return response.data;
      } catch (err) {
        console.log(err);
        console.error(
          "%c[comprador.store] ERROR en POST " + endpoint,
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
          console.error(
            "%c[Response Data]",
            "color: #F44336",
            err.response.data
          );
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
          console.log(err);
          console.error(
            "%c[Error de configuracion]",
            "color: #F44336",
            err.message || err
          );
        }

        console.error("%c[Error completo]", "color: #F44336", err);
        console.log(err);

        var message = "No se pudo registrar el comprador. Intentalo de nuevo.";

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

        this.error = message;
        throw new Error(message);
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
