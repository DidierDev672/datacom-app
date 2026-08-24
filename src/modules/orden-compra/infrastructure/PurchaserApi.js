import client from "src/api/client";

const BASE_URL = "/api/purchasers";

const FRIENDLY_ERROR =
  "Por ahora no pudimos obtener los compradores. No te preocupes, suele ser algo temporal: inténtalo de nuevo en unos segundos.";

function normalizePurchaser(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  return {
    id: raw.id != null ? String(raw.id) : "",
    comprador: raw.comprador || "",
    nit: raw.nit || "",
    ciudad: raw.ciudad || "",
    despacho: raw.despacho || "",
    direccion: raw.direccion || "",
  };
}

export const purchaserApi = {
  /**
   * GET /api/purchasers
   * - status 200 => { ok: true, results: [...] }
   * - status 400 (u otro) => { ok: false, message: mensaje amigable }
   */
  async listPurchasers() {
    try {
      const response = await client.get(BASE_URL, {
        validateStatus: function () {
          return true;
        },
      });

      const status = response && response.status;

      if (status === 200 && response.data) {
        const payload = response.data;
        const rawResults = Array.isArray(payload.results) ? payload.results : [];
        return {
          ok: true,
          results: rawResults.map(normalizePurchaser).filter(Boolean),
        };
      }

      return {
        ok: false,
        results: [],
        message:
          (response && response.data && response.data.message) ||
          FRIENDLY_ERROR,
      };
    } catch (error) {
      return {
        ok: false,
        results: [],
        message:
          (error && error.message) ||
          "Sin conexión en este momento. Revisa tu red e intenta de nuevo.",
      };
    }
  },
};
