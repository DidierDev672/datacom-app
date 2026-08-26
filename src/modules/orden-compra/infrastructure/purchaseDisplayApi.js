import client from "src/api/client";

const PURCHASER_BASE_URL = "/api/purchasers";
const SUPPLIER_BASE_URL = "/api/v1/terceros";

const comparisonCache = new Map();
const purchaserCache = new Map();
const supplierCache = new Map();

/**
 * Normaliza cualquier forma de respuesta del backend ({ results: [...] },
 * { results: {...} }, arreglo plano u objeto suelto) a una lista de registros.
 */
function collectRecords(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data.results)) {
    return data.results;
  }
  if (data.results && typeof data.results === "object") {
    return [data.results];
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

/** Mapper del registro de tercero/proveedor -> nombre para la tabla. */
function mapSupplierName(record) {
  if (!record) {
    return null;
  }
  return (
    record.razonSocial ||
    record.nombreRazonSocial ||
    record.nombreComercial ||
    record.name ||
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
 * GET /api/supplier-comparisons/{id}
 * Nombre de la comparación: campo `requestLabel` dentro de `results`.
 * Usa la instancia Axios compartida (baseURL + timeout) con async/await
 * y try/catch para estandarizar errores (p. ej. status 400).
 */
export async function fetchComparisonLabel(idQuote) {
  return cachedLookup(comparisonCache, idQuote, async function (cleanId) {
    try {
      var response = await client.get(
        "/api/supplier-comparisons/" + encodeURIComponent(cleanId),
        {
          validateStatus: function () {
            return true;
          },
        }
      );

      if (!response || response.status !== 200) {
        if (response && response.status === 400) {
          console.error(
            "[purchaseDisplayApi] Error 400 al obtener comparación",
            cleanId,
            response.data
          );
          throw new Error(
            "Se presentó un error al intentar obtener la comparación. No te preocupes: puedes cerrar e intentarlo de nuevo en unos segundos."
          );
        }
        console.error(
          "[purchaseDisplayApi] Respuesta inesperada al obtener comparación",
          response && response.status
        );
        throw new Error(
          "No pudimos cargar la comparación (código " +
            (response && response.status) +
            ")."
        );
      }

      var record = pickRecordById(response.data, cleanId, ["id"]);
      var label =
        record && record.requestLabel
          ? record.requestLabel
          : mapComparisonLabel(record);

      if (!label) {
        throw new Error("Respuesta sin requestLabel de comparación");
      }

      return label;
    } catch (error) {
      console.error(
        "[purchaseDisplayApi] Fallo al obtener comparación",
        cleanId,
        error && error.message ? error.message : error
      );
      throw error;
    }
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
 * GET /api/v1/terceros/{id}
 * Nombre del proveedor: campo `razonSocial` dentro de `results`.
 * Lanza error si el status no es 200 (p. ej. 400) o el registro no trae nombre.
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
          if (response && response.status === 400) {
            throw new Error(
              "Se presentó un error al intentar obtener la información del proveedor."
            );
          }
          throw new Error(
            "Terceros respondio " + (response && response.status)
          );
        }
        const record = pickRecordById(response.data, cleanId, [
          "id",
          "idProveedor",
        ]);
        const name = mapSupplierName(record);
        if (!name) {
          throw new Error("Respuesta sin razonSocial de proveedor");
        }
        return name;
      });
  });
}
