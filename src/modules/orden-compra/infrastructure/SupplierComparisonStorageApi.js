import { supplierComparisonApi } from "./SupplierComparisonApi";

const STORAGE_KEY = "datacom-supplier-comparisons";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading supplier comparisons:", error);
    return [];
  }
}

function writeAll(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records || []));
}

function removeLocalById(id) {
  const records = readAll().filter((item) => item.id !== id);
  writeAll(records);
}

function generateId() {
  return `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateCode(existingCount) {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String((existingCount || 0) + 1).padStart(4, "0");
  return `CMP-${y}${m}${d}-${seq}`;
}

function getWinnerSupplierKeys(payload) {
  const productWinners = (payload && payload.productWinners) || {};
  return [
    ...new Set(
      Object.values(productWinners).filter((supplierKey) =>
        Boolean(supplierKey)
      )
    ),
  ];
}

function findWinnerSummary(payload) {
  const summaries = payload && payload.supplierSummaries;
  const winnerKeys = getWinnerSupplierKeys(payload);

  if (!Array.isArray(summaries) || !winnerKeys.length) {
    return null;
  }

  if (winnerKeys.length === 1) {
    return summaries.find((item) => item.key === winnerKeys[0]) || null;
  }

  return {
    name: `${winnerKeys.length} proveedores`,
    nit: "",
    total: payload.optimalTotal || 0,
  };
}

function enrichRecord(baseRecord, payload) {
  const winner = findWinnerSummary(payload);
  const winnerKeys = getWinnerSupplierKeys(payload);
  return {
    ...baseRecord,
    requestId: payload.requestId || "",
    supplyOrderId: payload.supplyOrderId || "",
    requestLabel: payload.requestLabel || "",
    products: payload.products || [],
    suppliers: payload.suppliers || [],
    quotes: payload.quotes || {},
    bestPriceSupplierKey: payload.bestPriceSupplierKey || null,
    winnerSupplierKey: payload.winnerSupplierKey || null,
    preferredSupplierKey: payload.preferredSupplierKey || null,
    productWinners: payload.productWinners || {},
    optimalTotal: payload.optimalTotal || 0,
    supplierSummaries: payload.supplierSummaries || [],
    winnerName: winner ? winner.name : "",
    winnerNit: winner ? winner.nit || "" : "",
    winnerTotal:
      payload.optimalTotal != null
        ? payload.optimalTotal
        : winner
          ? winner.total || 0
          : 0,
    winnerSelectionMode: payload.winnerSelectionMode || "auto",
    hasMixedWinners: winnerKeys.length > 1,
    suppliersCount: Array.isArray(payload.suppliers)
      ? payload.suppliers.length
      : 0,
    productsCount: Array.isArray(payload.products)
      ? payload.products.length
      : 0,
  };
}

function sortComparisons(records) {
  return [...records].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt) -
      new Date(a.updatedAt || a.createdAt)
  );
}

function mergeRemoteAndLocal(remoteRecords, localRecords) {
  const merged = new Map();
  (localRecords || []).forEach((item) => {
    if (item && item.id) {
      merged.set(item.id, item);
    }
  });
  (remoteRecords || []).forEach((item) => {
    if (item && item.id) {
      merged.set(item.id, item);
    }
  });
  return sortComparisons(Array.from(merged.values()));
}

async function saveLocalRecord(record) {
  const records = readAll();
  const index = records.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.unshift(record);
  }
  writeAll(records);
  return record;
}

export const supplierComparisonStorageApi = {
  async listComparisons() {
    try {
      const remoteRecords = await supplierComparisonApi.listComparisons();
      const localRecords = readAll();
      return mergeRemoteAndLocal(remoteRecords, localRecords);
    } catch (error) {
      return sortComparisons(readAll());
    }
  },

  async getComparison(id) {
    try {
      const remoteRecord = await supplierComparisonApi.getComparison(id);
      if (remoteRecord) {
        await saveLocalRecord(remoteRecord);
        return remoteRecord;
      }
    } catch (error) {
      // fallback to local cache
    }
    const records = readAll();
    return records.find((item) => item.id === id) || null;
  },

  async createComparison(payload) {
    const records = readAll();
    const timestamp = new Date().toISOString();
    const localRecord = enrichRecord(
      {
        id: generateId(),
        code: generateCode(records.length),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      payload
    );

    try {
      const saved = await supplierComparisonApi.createComparison(localRecord);
      const record = enrichRecord(saved, { ...localRecord, ...saved });
      await saveLocalRecord(record);
      return record;
    } catch (error) {
      await saveLocalRecord(localRecord);
      throw error;
    }
  },

  async updateComparison(id, payload) {
    const records = readAll();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("No se encontró la comparación solicitada.");
    }

    const updated = enrichRecord(
      {
        ...records[index],
        updatedAt: new Date().toISOString(),
      },
      {
        ...records[index],
        ...payload,
      }
    );

    try {
      const saved = await supplierComparisonApi.updateComparison(id, updated);
      const record = enrichRecord(saved, { ...updated, ...saved });
      await saveLocalRecord(record);
      return record;
    } catch (error) {
      records[index] = updated;
      writeAll(records);
      throw error;
    }
  },

  async deleteComparison(id) {
    const normalizedId = id == null ? "" : String(id).trim();
    if (!normalizedId) {
      throw new Error("No se pudo identificar la comparación a eliminar.");
    }

    await supplierComparisonApi.deleteComparison(normalizedId);
    removeLocalById(normalizedId);
    return true;
  },

  async clearAllComparisons() {
    writeAll([]);
    return true;
  },
};
