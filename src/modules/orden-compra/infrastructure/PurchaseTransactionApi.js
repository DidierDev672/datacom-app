import axios from "axios";
import { URL_API } from "src/utils/config";

const BASE_URL = `${URL_API}/api/purchase-order`;

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

function normalizeItemsFromDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details
    .map((detail, idx) => {
      const cantidad = Number(detail && detail.quantity) || 0;
      const valorUnitario = Number(detail && detail.unitPrice) || 0;
      if (cantidad <= 0) return null;

      return {
        id: (detail && detail.id) || `detail-${idx}`,
        productName: (detail && detail.productName) || "Producto",
        quantity: String(cantidad),
        unit: (detail && detail.unit) || "UND",
        unitPrice: String(valorUnitario),
      };
    })
    .filter(Boolean);
}

function normalizeItemsFromRequest(request) {
  if (!request) {
    return [];
  }

  const linkedDetails =
    request._linkedSupplyOrder && Array.isArray(request._linkedSupplyOrder.details)
      ? request._linkedSupplyOrder.details
      : null;
  const directDetails = Array.isArray(request.details) ? request.details : null;
  const details = linkedDetails || directDetails;

  if (details && details.length) {
    const fromDetails = normalizeItemsFromDetails(details);
    if (fromDetails.length) {
      return fromDetails;
    }
  }

  if (!Array.isArray(request.proyectos)) {
    return [];
  }

  const items = [];
  request.proyectos.forEach((project) => {
    const products = Array.isArray(project.productosServicios)
      ? project.productosServicios
      : [];
    products.forEach((product, idx) => {
      const cantidad = Number(product && product.cantidad) || 0;
      const valorUnitario = Number(product && product.valorUnitario) || 0;
      if (cantidad <= 0) return;

      items.push({
        id:
          (product && product.id) ||
          `${project && project.planAbastecimientoId ? project.planAbastecimientoId : "plan"}-${idx}`,
        productName:
          (product && product.descripcion) ||
          (project && project.item) ||
          "Producto",
        quantity: String(cantidad),
        unit: (product && product.unidadMedida) || "UND",
        unitPrice: String(valorUnitario),
      });
    });
  });

  return items;
}

export const purchaseTransactionApi = {
  async registerTransaction(payload) {
    try {
      const response = await axios.post(`${BASE_URL}/`, payload);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se pudo registrar la transacción de compra.")
      );
    }
  },

  async listTransactions() {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      const data = toResponseData(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se pudieron consultar las transacciones de compra.")
      );
    }
  },

  async getTransactionDetail(id) {
    try {
      const response = await axios.get(`${BASE_URL}/${id}/detail`);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se pudo obtener el detalle de la transacción.")
      );
    }
  },

  async updateTransaction(id, payload) {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, payload);
      return toResponseData(response);
    } catch (error) {
      throw new Error(
        extractApiError(error, "No se pudo actualizar la transacción de compra.")
      );
    }
  },

  buildPayloadFromSelection({
    selectedRequest,
    purchaseManager,
    supplierId: supplierIdOverride,
  }) {
    const request = selectedRequest || {};
    const supplyOrderId =
      request.supplyOrderId ||
      request.supply_order_id ||
      request.purchaseOrderSupplyId ||
      request._resolvedSupplyOrderId ||
      "";

    const linkedSupplier =
      request._resolvedSupplierId ||
      request.supplierId ||
      request.proveedorId ||
      request.proveedorNit ||
      "";

    return {
      supplyOrderId,
      assignedToUserId: purchaseManager || "",
      createdByUserId: purchaseManager || "",
      supplierId: supplierIdOverride || linkedSupplier || "",
      items: normalizeItemsFromRequest(request),
    };
  },
};

