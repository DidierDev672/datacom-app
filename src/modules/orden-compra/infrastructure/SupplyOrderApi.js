import axios from "axios";
import { URL_API } from "src/utils/config";
import {
  mapSupplyOrderToSelection,
  resolveSupplierIdFromOrder,
  resolveSupplyOrderLinkage,
} from "../utils/supplyOrderLinkage";

const BASE_URL = `${URL_API}/api/supply-order`;

function toResponseData(response) {
  if (!response) return null;
  return response.data && response.data.results !== undefined
    ? response.data.results
    : response.data;
}

let approvedOrdersCache = null;
let approvedOrdersPromise = null;

export const supplyOrderApi = {
  async fetchApprovedOrders({ forceRefresh = false } = {}) {
    if (!forceRefresh && approvedOrdersCache) {
      return approvedOrdersCache;
    }

    if (!forceRefresh && approvedOrdersPromise) {
      return approvedOrdersPromise;
    }

    approvedOrdersPromise = axios
      .get(`${BASE_URL}/approved/all`)
      .then((response) => {
        const data = toResponseData(response);
        approvedOrdersCache = Array.isArray(data) ? data : [];
        return approvedOrdersCache;
      })
      .catch(() => {
        approvedOrdersCache = [];
        return approvedOrdersCache;
      })
      .finally(() => {
        approvedOrdersPromise = null;
      });

    return approvedOrdersPromise;
  },

  clearApprovedOrdersCache() {
    approvedOrdersCache = null;
    approvedOrdersPromise = null;
  },

  async fetchOrderById(orderId, { forceRefresh = false } = {}) {
    if (!orderId) {
      return null;
    }

    const cacheKey = String(orderId);
    if (!forceRefresh && this._orderCache && this._orderCache[cacheKey]) {
      return this._orderCache[cacheKey];
    }

    try {
      const response = await axios.get(`${BASE_URL}/${orderId}`);
      const data = toResponseData(response);
      if (!this._orderCache) {
        this._orderCache = {};
      }
      if (data) {
        this._orderCache[cacheKey] = data;
      }
      return data;
    } catch (error) {
      return null;
    }
  },

  async resolveLinkageForRequest(request, { forceRefresh = false } = {}) {
    const supplyOrders = await this.fetchApprovedOrders({ forceRefresh });
    let linkage = resolveSupplyOrderLinkage(request, supplyOrders);

    if (!linkage.supplyOrderId && request && request.id) {
      const directOrder = await this.fetchOrderById(request.id);
      if (directOrder && directOrder.id) {
        linkage = {
          supplyOrderId: directOrder.id,
          supplierId: resolveSupplierIdFromOrder(directOrder),
          linkedSupplyOrder: directOrder,
          matchScore: 100,
        };
      }
    }

    if (linkage.supplyOrderId && !linkage.linkedSupplyOrder) {
      linkage.linkedSupplyOrder =
        supplyOrders.find((order) => order && order.id === linkage.supplyOrderId) ||
        (await this.fetchOrderById(linkage.supplyOrderId));
    }

    if (linkage.supplyOrderId && !linkage.supplierId && linkage.linkedSupplyOrder) {
      linkage.supplierId = resolveSupplierIdFromOrder(linkage.linkedSupplyOrder);
    }

    return linkage;
  },

  mapOrderToSelection(order) {
    return mapSupplyOrderToSelection(order);
  },
};
