import { defineStore } from "pinia";
import { ref } from "@vue/composition-api";
import client from "src/api/client";

const LIST_ERROR_MESSAGE =
  "Se presentó un problema al obtener los registros de las compras. Por favor inténtalo de nuevo en unos momentos.";
const DELETE_ERROR_MESSAGE =
  "No fue posible eliminar el registro de la compra. Verifica tu conexión e inténtalo de nuevo.";

/**
 * Store Pinia (Composition API / setup store) para el listado de
 * órdenes de compra-servicio registradas en el backend.
 *
 * Consume GET /purchase-service usando la instancia preconfigurada
 * de Axios (`src/api/client.js`), que ya resuelve baseURL, tenant y token.
 */
export const usePurchaseServiceListStore = defineStore(
  "purchaseServiceList",
  () => {
    // ── State ──────────────────────────────────────────────────────────
    /** Datos obtenidos del endpoint (campo `results`). */
    const purchases = ref([]);
    /** true mientras hay una petición HTTP en curso. */
    const isLoading = ref(false);
    /** Mensaje de error amigable para el usuario ("" cuando no hay error). */
    const error = ref("");

    // ── Actions ────────────────────────────────────────────────────────
    /**
     * GET /purchase-service
     * - status 200 => guarda `results` y los expone en `purchases`.
     * - status 400 u otro código => limpia datos y escribe un mensaje de
     *   error amigable; la página solo debe mostrar el aviso.
     */
    async function fetchPurchases() {
      isLoading.value = true;
      error.value = "";
      try {
        const response = await client.get("/purchase-service", {
          validateStatus: function () {
            return true;
          },
        });

        const status = response && response.status;
        if (status !== 200 || !response.data) {
          purchases.value = [];
          if (status === 400) {
            error.value = LIST_ERROR_MESSAGE;
          }
          return [];
        }

        purchases.value = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        return purchases.value;
      } catch (err) {
        purchases.value = [];
        error.value = LIST_ERROR_MESSAGE;
        return [];
      } finally {
        isLoading.value = false;
      }
    }

    /**
     * DELETE /purchase-service/{id}
     * Elimina el registro y lo quita del estado local cuando el backend
     * confirma con 200/204. Devuelve true si la eliminación fue exitosa.
     */
    async function removePurchase(id) {
      const cleanId = id != null ? String(id).trim() : "";
      if (!cleanId) {
        return false;
      }

      isLoading.value = true;
      error.value = "";
      try {
        const response = await client.delete(
          "/purchase-service/" + encodeURIComponent(cleanId),
          {
            validateStatus: function () {
              return true;
            },
          }
        );

        const status = response && response.status;
        if (status === 200 || status === 204) {
          purchases.value = purchases.value.filter(
            (purchase) => String(purchase.id) !== cleanId
          );
          return true;
        }

        error.value = DELETE_ERROR_MESSAGE;
        return false;
      } catch (err) {
        error.value = DELETE_ERROR_MESSAGE;
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    function clearError() {
      error.value = "";
    }

    return {
      purchases,
      isLoading,
      error,
      fetchPurchases,
      removePurchase,
      clearError,
    };
  }
);
