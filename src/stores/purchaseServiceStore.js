import { defineStore } from "pinia";
import client from "../api/client";

/**
 * Store para el servicio de compras (POST /purchase-service).
 * Estado reactivo que alimenta al modal de carga/resultado.
 */
export const usePurchaseServiceStore = defineStore("purchaseService", {
  state: () => ({
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
    // Órdenes de compra-servicio asociadas a una cotización
    // (respuesta de GET /purchase-service/quote/{idQuote}).
    quotePurchases: [],
  }),

  actions: {
    /**
     * Consulta las órdenes de compra-servicio registradas para una
     * cotización: GET /purchase-service/quote/{idQuote}
     *
     * - status 200 => guarda `results` y responde { ok: true, results }.
     * - status 400 u otro código / error de red => limpia el estado y
     *   responde { ok: false } sin efectos adicionales, de modo que la UI
     *   NO trate la comparación como "con compra registrada".
     */
    async fetchPurchasesByQuote(idQuote) {
      const cleanId = idQuote != null ? String(idQuote).trim() : "";
      this.quotePurchases = [];
      if (!cleanId) {
        return { ok: false };
      }
      try {
        const response = await client.get(
          "/purchase-service/quote/" + encodeURIComponent(cleanId),
          {
            // Evita que el interceptor rechace códigos != 2xx: necesitamos
            // inspeccionar el status manualmente (200 vs 400).
            validateStatus: function () {
              return true;
            },
          }
        );
        const status = response && response.status;

        if (status !== 200 || !response.data) {
          return { ok: false };
        }

        const results = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        this.quotePurchases = results;
        return { ok: true, results: results };
      } catch (error) {
        this.quotePurchases = [];
        return { ok: false };
      }
    },

    /**
     * Registra la compra. Devuelve true cuando el backend responde
     * con status 200 (OK) o 201 (Created); ambos significan que la
     * compra fue creada correctamente.
     */
    async registerPurchase(payload) {
      this.resetStatus();
      this.isLoading = true;
      try {
        // Timeout ampliado para esta operación: el backend puede tardar
        // más que el timeout global del cliente y un corte prematuro
        // dejaba la compra registrada en BD aunque el front mostrara error.
        const response = await client.post("/purchase-service", payload, {
          timeout: 60000,
        });
        const status = response && response.status;

        if (status === 200 || status === 201) {
          this.isSuccess = true;
          return true;
        }

        this.isSuccess = false;
        this.errorMessage =
          "El servicio respondió con el código " +
          (status != null ? status : "desconocido") +
          ". La compra no fue registrada.";
        return false;
      } catch (error) {
        this.isSuccess = false;
        this.errorMessage = extractErrorMessage(error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /** Limpia el estado del resultado (cierra el modal). */
    resetStatus() {
      this.isLoading = false;
      this.isSuccess = false;
      this.errorMessage = "";
      this.quotePurchases = [];
    },
  },
});

function extractErrorMessage(error) {
  if (!error) {
    return "Ocurrió un error al intentar registrar la compra.";
  }
  if (typeof error === "string") {
    return error;
  }

  // Timeout: la petición se cortó en el front pero el backend pudo
  // completar el registro. No afirmamos que la compra falló.
  const isTimeout =
    error.code === "ECONNABORTED" ||
    (error.message && error.message.indexOf("timeout") !== -1);
  if (isTimeout) {
    return (
      "El servidor tardó más de lo esperado en responder. " +
      "Es posible que la compra sí se haya registrado; " +
      "verifica la lista antes de volver a intentarlo para evitar duplicados."
    );
  }

  if (error.message) {
    return String(error.message);
  }
  if (error.error && typeof error.error === "string") {
    return error.error;
  }
  return "Ocurrió un error al intentar registrar la compra.";
}
