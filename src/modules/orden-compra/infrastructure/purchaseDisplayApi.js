import client from "src/api/client";
import { supplierComparisonApi } from "./SupplierComparisonApi";

const PURCHASER_BASE_URL = "/api/purchasers";
const SUPPLIER_BASE_URL = "/api/v1/proveedores";

const comparisonCache = new Map();
const purchaserCache = new Map();
const supplierCache = new Map();

/**
 * Normaliza cualquier forma de respuesta del backend ({ results: [...] },
 * arreglo plano u objeto suelto) a una lista de registros.
 */
function collectRecords(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data.results)) {
    return data.results;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return typeof data === "object" ? [data] : [];
}

/**
 * Mapper: localiza dentro de los resultados el registro cuyo id coincide
 * con el solicitado (soporta varios nombres de campo de id). Si no hay
 * coincidencia pero hay registros, devuelve el primero.
 */
function pickRecordById(data, wantedId, idFields) {
  const records = collectRecords(data);
  const target = wantedId != null ? String(wantedId).trim().toLowerCase() : "";
  if (!target) {
    return records.length ? records[0] : null;
  }
  let index;
  let fieldIndex;
  for (index = 0; index < records.length; index++) {
    const record = records[index];
    if (!record || typeof record !== "object") {
      continue;
    }
    for (fieldIndex = 0; fieldIndex < idFields.length; fieldIndex++) {
      const value = record[idFields[fieldIndex]];
      if (
        value != null &&
        String(value).trim().toLowerCase() === target
      ) {
        return record;
      }
    }
  }
  return records.length ? records[0] : null;
}

/** Mapper del registro de comparación -> etiqueta para la tabla. */
function mapComparisonLabel(record) {
  if (!record) {
    return null;
  }
  return record.requestLabel || record.code || null;
}

/** Mapper del registro de comprador -> nombre para la tabla. */
function mapPurchaserName(record) {
  if (!record) {
    return null;
  }
  return record.comprador || record.nombre || record.name || null;
}

/** Mapper del registro de proveedor -> nombre para la tabla. */
function mapSupplierName(record) {
  if (!record) {
    return null;
  }
  return (
    record.nombreRazonSocial ||
    record.razonSocial ||
    record.name ||
    record.nit ||
    null
  );
}

/**
 * Lookup con caché de promesas: evita repetir peticiones para el mismo id
 * y deduplica las llamadas en paralelo. Si falla, se retira del caché para
 * permitir un reintento en la siguiente ronda de resolución.
 */
function cachedLookup(cache, key, loader) {
  const cleanKey = key != null ? String(key).trim() : "";
  if (!cleanKey) {
    return Promise.resolve(null);
  }
  if (cache.has(cleanKey)) {
    return cache.get(cleanKey);
  }
  const pending = Promise.resolve()
    .then(function () {
      return loader(cleanKey);
    })
    .catch(function () {
      cache.delete(cleanKey);
      return null;
    });
  cache.set(cleanKey, pending);
  return pending;
}

/**
 * GET /api/supplier-comparisons/{idQuote}
 * Etiqueta legible de la comparación: `requestLabel` (fallback `code`).
 * Resuelve null si el status no es 200 o no hay resultados.
 */
export function fetchComparisonLabel(idQuote) {
  return cachedLookup(comparisonCache, idQuote, function (cleanId) {
    return supplierComparisonApi.getComparison(cleanId).then(function (data) {
      const record = pickRecordById(data, cleanId, ["id"]);
      return mapComparisonLabel(record);
    });
  });
}

/**
 * GET /api/purchasers/{id}
 * Nombre del comprador: campo `comprador` dentro de `results`.
 * Lanza error si el status no es 200 o el registro no trae nombre,
 * de modo que `cachedLookup` lo retire del caché y permita reintentos.
 */
export function fetchPurchaserName(id) {
  return cachedLookup(purchaserCache, id, function (cleanId) {
    return client
      .get(PURCHASER_BASE_URL + "/" + encodeURIComponent(cleanId), {
        validateStatus: function () {
          return true;
        },
      })
      .then(function (response) {
        if (!response || response.status !== 200) {
          throw new Error("Purchasers respondio " + response.status);
        }
        const record = pickRecordById(response.data, cleanId, ["id"]);
        const name = mapPurchaserName(record);
        if (!name) {
          throw new Error("Respuesta sin nombre de comprador");
        }
        return name;
      });
  });
}

/**
 * GET /api/v1/proveedores/{id}
 * Nombre del proveedor: campo `nombreRazonSocial`. Lanza error si el
 * status no es 200 o el registro no trae nombre.
 */
export function fetchSupplierName(id) {
  return cachedLookup(supplierCache, id, function (cleanId) {
    return client
      .get(SUPPLIER_BASE_URL + "/" + encodeURIComponent(cleanId), {
        validateStatus: function () {
          return true;
        },
      })
      .then(function (response) {
        if (!response || response.status !== 200) {
          throw new Error("Proveedores respondio " + response.status);
        }
        const record = pickRecordById(
          response.data,
          cleanId,
          ["idProveedor", "id"]
        );
        const name = mapSupplierName(record);
        if (!name) {
          throw new Error("Respuesta sin nombre de proveedor");
        }
        return name;
      });
  });
}
