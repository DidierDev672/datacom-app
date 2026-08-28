function getOrderDetailsFromOrder(order) {
  if (!order) {
    return [];
  }

  if (Array.isArray(order.details) && order.details.length) {
    return order.details;
  }

  if (Array.isArray(order.items) && order.items.length) {
    return order.items;
  }

  return [];
}

function getAllOrderDetailsFromRequest(request) {
  if (!request) {
    return [];
  }

  const collected = [];
  const seen = new Set();

  const appendDetails = (details) => {
    (details || []).forEach((detail) => {
      if (!detail) {
        return;
      }
      const key = [
        detail.id,
        detail.productName,
        detail.descripcion,
        detail.description,
        detail.quantity,
        detail.cantidad,
      ]
        .filter((value) => value != null && value !== "")
        .join("|");
      if (!seen.has(key)) {
        seen.add(key);
        collected.push(detail);
      }
    });
  };

  appendDetails(getOrderDetailsFromOrder(request._linkedSupplyOrder));
  appendDetails(request.details);

  return collected;
}

function getPlanNameFromRequest(request) {
  if (!request) {
    return "";
  }

  const fromProyectos = Array.isArray(request.proyectos)
    ? request.proyectos
        .map((project) => project && (project.planAbastecimiento || project.item))
        .filter(Boolean)
    : [];

  if (fromProyectos.length) {
    return [...new Set(fromProyectos)].join(", ");
  }

  const fromPlanItems =
    Array.isArray(request.planItems) && request.planItems.length
      ? request.planItems
          .map((item) => item && item.planItemDescription)
          .filter(Boolean)
      : [];

  if (fromPlanItems.length) {
    return [...new Set(fromPlanItems)].join(", ");
  }

  return "";
}

function extractProductsFromOrderDetails(details, planName = "") {
  if (!Array.isArray(details) || !details.length) {
    return [];
  }

  return details
    .map((detail, idx) =>
      normalizeProduct(
        {
          id: detail.id,
          productName:
            detail.productName ||
            detail.descripcion ||
            detail.description ||
            "",
          quantity:
            detail.quantity != null
              ? detail.quantity
              : detail.cantidad != null
                ? detail.cantidad
                : detail.qty,
          unit: detail.unit || detail.unidadMedida,
          unitPrice:
            detail.unitPrice != null
              ? detail.unitPrice
              : detail.valorUnitario != null
                ? detail.valorUnitario
                : detail.unit_price,
          planName,
        },
        `order-${idx}`
      )
    )
    .filter(Boolean);
}

function extractProductsFromSolicitudProjects(request) {
  if (!request || !Array.isArray(request.proyectos)) {
    return [];
  }

  const products = [];
  request.proyectos.forEach((project, projectIndex) => {
    const projectProducts = Array.isArray(project.productosServicios)
      ? project.productosServicios
      : [];
    const planName = project.planAbastecimiento || project.item || "";

    projectProducts.forEach((product, idx) => {
      const description =
        product && product.descripcion ? String(product.descripcion).trim() : "";
      if (!description) {
        return;
      }

      const normalized = normalizeProduct(
        {
          id:
            product.id ||
            `${project.id || project.planAbastecimientoId || `project-${projectIndex}`}-${idx}`,
          productName: description,
          quantity: product.cantidad,
          unit: product.unidadMedida,
          unitPrice: product.valorUnitario,
          planName,
        },
        `solicitud-${projectIndex}-${idx}`
      );

      if (normalized) {
        products.push(normalized);
      }
    });
  });

  return products;
}

function productDedupKey(product) {
  return [
    String(product.productName || "").trim().toLowerCase(),
    product.quantity,
    String(product.unit || "").trim().toLowerCase(),
    String(product.planName || "").trim().toLowerCase(),
  ].join("|");
}

function mergeComparisonProducts(primary, secondary) {
  const merged = new Map();

  (primary || []).forEach((product) => {
    merged.set(productDedupKey(product), product);
  });

  (secondary || []).forEach((product) => {
    const key = productDedupKey(product);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, product);
      return;
    }

    if (!existing.referenceUnitPrice && product.referenceUnitPrice) {
      merged.set(key, {
        ...existing,
        referenceUnitPrice: product.referenceUnitPrice,
      });
    }
  });

  return Array.from(merged.values());
}

export function extractComparisonProducts(request) {
  if (!request) {
    return [];
  }

  const planName = getPlanNameFromRequest(request);
  const fromOrder = extractProductsFromOrderDetails(
    getAllOrderDetailsFromRequest(request),
    planName
  );
  const fromSolicitud = extractProductsFromSolicitudProjects(request);

  if (fromOrder.length && fromSolicitud.length) {
    return mergeComparisonProducts(fromOrder, fromSolicitud);
  }

  if (fromSolicitud.length) {
    return fromSolicitud;
  }

  if (fromOrder.length) {
    return fromOrder;
  }

  return [];
}

function normalizeProduct(raw, index) {
  const quantity = Number(raw.quantity) || 0;
  const productName = raw.productName ? String(raw.productName).trim() : "";

  if (quantity <= 0 || !productName) {
    return null;
  }

  const referenceUnitPrice = Number(raw.unitPrice) || 0;
  return {
    id: String(raw.id || `product-${index}`),
    productName,
    quantity,
    unit: raw.unit || "UND",
    referenceUnitPrice,
    planName: raw.planName || "",
  };
}

export function createSupplierEntry(supplier) {
  const id = supplier && supplier.id ? String(supplier.id) : "";
  const nit =
    supplier && (supplier.nit || supplier.identificacion)
      ? String(supplier.nit || supplier.identificacion)
      : "";
  const name =
    (supplier &&
      (supplier.name ||
        supplier.supplier ||
        supplier.razonSocial ||
        supplier.nombreComercial)) ||
    nit ||
    "Proveedor";
  return {
    key: nit || id || `supplier-${Date.now()}`,
    id,
    nit,
    name,
    tipoTercero:
      supplier && supplier.tipoTercero ? String(supplier.tipoTercero) : "",
  };
}

export function createInitialQuotes(products, suppliers) {
  const quotes = {};
  (suppliers || []).forEach((supplier) => {
    quotes[supplier.key] = {};
    (products || []).forEach((product) => {
      quotes[supplier.key][product.id] = "";
    });
  });
  return quotes;
}

export function getQuoteValue(quotes, supplierKey, productId) {
  const supplierQuotes = quotes && quotes[supplierKey];
  if (!supplierQuotes) {
    return null;
  }
  const value = supplierQuotes[productId];
  if (value === "" || value == null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function calculateLineTotal(quantity, unitPrice) {
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  return qty * price;
}

export function getBestPriceSupplierKeyForProduct(productId, suppliers, quotes) {
  let bestKey = null;
  let bestPrice = null;

  (suppliers || []).forEach((supplier) => {
    const unitPrice = getQuoteValue(quotes, supplier.key, productId);
    if (unitPrice == null) {
      return;
    }
    if (bestPrice == null || unitPrice < bestPrice) {
      bestPrice = unitPrice;
      bestKey = supplier.key;
    }
  });

  return bestKey;
}

export function buildProductWinnersMap(
  products,
  suppliers,
  quotes,
  storedWinners = null
) {
  const map = {};

  (products || []).forEach((product) => {
    const storedWinner =
      storedWinners && storedWinners[product.id]
        ? storedWinners[product.id]
        : null;

    if (storedWinner) {
      map[product.id] = storedWinner;
      return;
    }

    map[product.id] = getBestPriceSupplierKeyForProduct(
      product.id,
      suppliers,
      quotes
    );
  });

  return map;
}

export function calculateProductWinnersTotal(products, productWinners, quotes) {
  return (products || []).reduce((total, product) => {
    const winnerKey = productWinners && productWinners[product.id];
    if (!winnerKey) {
      return total;
    }

    const unitPrice = getQuoteValue(quotes, winnerKey, product.id);
    if (unitPrice == null) {
      return total;
    }

    return total + calculateLineTotal(product.quantity, unitPrice);
  }, 0);
}

export function countProductsWonBySupplier(productWinners) {
  const counts = {};

  Object.values(productWinners || {}).forEach((supplierKey) => {
    if (!supplierKey) {
      return;
    }
    counts[supplierKey] = (counts[supplierKey] || 0) + 1;
  });

  return counts;
}

export function getUniqueWinnerSupplierKeys(productWinners) {
  return [
    ...new Set(
      Object.values(productWinners || {}).filter((supplierKey) =>
        Boolean(supplierKey)
      )
    ),
  ];
}

export function calculateSupplierSelectedTotal(
  supplierKey,
  products,
  productWinners,
  quotes
) {
  return (products || []).reduce((total, product) => {
    if (!productWinners || productWinners[product.id] !== supplierKey) {
      return total;
    }

    const unitPrice = getQuoteValue(quotes, supplierKey, product.id);
    if (unitPrice == null) {
      return total;
    }

    return total + calculateLineTotal(product.quantity, unitPrice);
  }, 0);
}

export function allProductsHaveWinners(products, productWinners) {
  return (products || []).every(
    (product) => productWinners && productWinners[product.id]
  );
}

export function hasManualProductWinnerOverrides(
  products,
  suppliers,
  quotes,
  productWinners
) {
  if (!productWinners || !Object.keys(productWinners).length) {
    return false;
  }

  return (products || []).some((product) => {
    const manualWinner = productWinners[product.id];
    if (!manualWinner) {
      return false;
    }
    const autoWinner = getBestPriceSupplierKeyForProduct(
      product.id,
      suppliers,
      quotes
    );
    return manualWinner !== autoWinner;
  });
}

export function buildSupplierSummaries(products, suppliers, quotes) {
  return (suppliers || []).map((supplier) => {
    let total = 0;
    let missingQuotes = 0;

    (products || []).forEach((product) => {
      const unitPrice = getQuoteValue(quotes, supplier.key, product.id);
      if (unitPrice == null) {
        missingQuotes += 1;
        return;
      }
      total += calculateLineTotal(product.quantity, unitPrice);
    });

    return {
      ...supplier,
      total,
      missingQuotes,
      isComplete: missingQuotes === 0 && (products || []).length > 0,
    };
  });
}

export function buildComparisonResult({
  products,
  suppliers,
  quotes,
  preferredSupplierKey = null,
  productWinners = null,
  winnerSelectionMode = "auto",
}) {
  const useManualWinners =
    winnerSelectionMode === "manual" &&
    productWinners &&
    Object.keys(productWinners).length > 0;

  const resolvedProductWinners = buildProductWinnersMap(
    products,
    suppliers,
    quotes,
    useManualWinners ? productWinners : null
  );

  if (
    !useManualWinners &&
    preferredSupplierKey &&
    (products || []).length
  ) {
    (products || []).forEach((product) => {
      if (
        getQuoteValue(quotes, preferredSupplierKey, product.id) != null
      ) {
        resolvedProductWinners[product.id] = preferredSupplierKey;
      }
    });
  }

  const productWinCounts = countProductsWonBySupplier(resolvedProductWinners);
  const winnerSupplierKeys = getUniqueWinnerSupplierKeys(
    resolvedProductWinners
  );
  const summaries = buildSupplierSummaries(products, suppliers, quotes);
  const completeSummaries = summaries.filter((item) => item.isComplete);

  let bestPriceSupplierKey = null;
  if (completeSummaries.length) {
    const best = completeSummaries.reduce((current, candidate) =>
      candidate.total < current.total ? candidate : current
    );
    bestPriceSupplierKey = best.key;
  }

  const bestTotal =
    bestPriceSupplierKey != null
      ? completeSummaries.find((item) => item.key === bestPriceSupplierKey)
          .total
      : null;

  const optimalTotal = calculateProductWinnersTotal(
    products,
    resolvedProductWinners,
    quotes
  );

  const enrichedSummaries = summaries.map((summary) => {
    const productsWon = productWinCounts[summary.key] || 0;
    const selectedTotal = calculateSupplierSelectedTotal(
      summary.key,
      products,
      resolvedProductWinners,
      quotes
    );
    const differenceFromBest =
      bestTotal != null && summary.isComplete
        ? summary.total - bestTotal
        : null;
    const differencePercent =
      bestTotal != null && summary.isComplete && bestTotal > 0
        ? (differenceFromBest / bestTotal) * 100
        : null;

    return {
      ...summary,
      productsWon,
      selectedTotal,
      isBestPrice: summary.key === bestPriceSupplierKey,
      differenceFromBest,
      differencePercent,
      isPreferred: summary.key === preferredSupplierKey,
      isWinner: productsWon > 0,
      hasManualSelections:
        useManualWinners && productsWon > 0 && summary.key !== bestPriceSupplierKey,
    };
  });

  const winnerSupplierKey =
    winnerSupplierKeys.length === 1 ? winnerSupplierKeys[0] : null;

  return {
    supplierSummaries: enrichedSummaries,
    bestPriceSupplierKey,
    winnerSupplierKey,
    preferredSupplierKey: preferredSupplierKey || null,
    productWinners: resolvedProductWinners,
    optimalTotal,
    hasComparableSuppliers: completeSummaries.length >= 2,
    hasMixedWinners: winnerSupplierKeys.length > 1,
    hasAllProductWinners: allProductsHaveWinners(
      products,
      resolvedProductWinners
    ),
    winnerSelectionMode,
  };
}

export function buildRequestLabel(request) {
  if (!request) {
    return "";
  }
  if (request.nombreOrden && request.nombreOrden.trim()) {
    return request.nombreOrden.trim();
  }
  if (request.descripcionNecesidad) {
    return request.descripcionNecesidad;
  }
  if (request.item) {
    return request.item;
  }
  if (request.codigo) {
    return request.codigo;
  }
  return request.id ? String(request.id) : "";
}

export function buildComparisonPayload({
  request,
  products,
  suppliers,
  quotes,
  comparison,
}) {
  return {
    requestId: request && request.id,
    supplyOrderId:
      (request && request.supplyOrderId) ||
      (request && request._resolvedSupplyOrderId) ||
      "",
    requestLabel: buildRequestLabel(request),
    products,
    suppliers,
    quotes,
    bestPriceSupplierKey: comparison.bestPriceSupplierKey,
    winnerSupplierKey: comparison.winnerSupplierKey,
    preferredSupplierKey: comparison.preferredSupplierKey,
    productWinners: comparison.productWinners || {},
    optimalTotal: comparison.optimalTotal || 0,
    supplierSummaries: comparison.supplierSummaries,
    winnerSelectionMode: comparison.winnerSelectionMode || "auto",
  };
}
