function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractPlanItemIds(request) {
  if (!request || !Array.isArray(request.proyectos)) {
    return [];
  }

  const ids = new Set();
  request.proyectos.forEach((project) => {
    if (!project) return;
    [project.planAbastecimientoId, project.itemId, project.id].forEach((id) => {
      const normalized = String(id || "").trim();
      if (normalized) {
        ids.add(normalized);
      }
    });
  });

  return Array.from(ids);
}

export function resolveSupplierIdFromOrder(order) {
  if (!order) return "";

  const supplier = order.supplier || {};
  return (
    supplier.nit ||
    supplier.supplierId ||
    order.supplierId ||
    order.supplier_id ||
    order.supplierNit ||
    ""
  );
}

function getOrderDetails(order) {
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

function getDetailQuantity(detail) {
  if (!detail) return 0;
  const raw =
    detail.quantity != null
      ? detail.quantity
      : detail.cantidad != null
        ? detail.cantidad
        : detail.qty;
  return Number(raw) || 0;
}

export function hasOrderLineItems(order) {
  const details = getOrderDetails(order);
  return details.some(
    (detail) =>
      getDetailQuantity(detail) > 0 &&
      !!(
        detail.productName ||
        detail.descripcion ||
        detail.description
      )
  );
}

function hasSolicitudLineItems(request) {
  if (!request || !Array.isArray(request.proyectos)) {
    return false;
  }

  return request.proyectos.some((project) => {
    const products = Array.isArray(project.productosServicios)
      ? project.productosServicios
      : [];
    return products.some(
      (product) =>
        Number(product && product.cantidad) > 0 &&
        !!(product && product.descripcion && String(product.descripcion).trim())
    );
  });
}

function resolveRequestProyectos(request, mappedOrder) {
  const fromSolicitud = Array.isArray(request && request.proyectos)
    ? request.proyectos
    : [];

  if (hasSolicitudLineItems({ proyectos: fromSolicitud })) {
    return fromSolicitud;
  }

  const fromOrder =
    mappedOrder && Array.isArray(mappedOrder.proyectos)
      ? mappedOrder.proyectos
      : [];
  if (fromOrder.length) {
    return fromOrder;
  }

  return fromSolicitud;
}

function mapDetailsToProyectos(order) {
  const details = getOrderDetails(order);
  if (!details.length) {
    return [];
  }

  const planNames = Array.isArray(order.planItems)
    ? order.planItems
        .map((item) => item && item.planItemDescription)
        .filter(Boolean)
    : [];

  return [
    {
      id: order.id,
      planAbastecimiento: planNames.join(", "),
      productosServicios: details.map((detail) => ({
        id: detail.id,
        descripcion:
          detail.productName ||
          detail.descripcion ||
          detail.description ||
          "",
        cantidad: getDetailQuantity(detail),
        unidadMedida: detail.unit || detail.unidadMedida || "UND",
        valorUnitario:
          detail.unitPrice != null
            ? Number(detail.unitPrice)
            : detail.valorUnitario != null
              ? Number(detail.valorUnitario)
              : 0,
      })),
    },
  ];
}

export async function ensureSolicitudLineItems(
  request,
  solicitudRepository,
  options = {}
) {
  const { forceRefresh = false } = options;

  if (!request) {
    return request;
  }

  if (!forceRefresh && hasSolicitudLineItems(request)) {
    return request;
  }

  if (!request.id || !solicitudRepository) {
    return request;
  }

  try {
    const fullRequest = await solicitudRepository.obtenerPorId(request.id);
    if (!fullRequest) {
      return request;
    }

    return {
      ...request,
      ...fullRequest,
      nombreOrden: request.nombreOrden || fullRequest.nombreOrden || "",
      supplyOrderId: request.supplyOrderId || fullRequest.supplyOrderId || "",
      supplierId: request.supplierId || fullRequest.supplierId || "",
      proyectos: Array.isArray(fullRequest.proyectos) && fullRequest.proyectos.length
        ? fullRequest.proyectos
        : request.proyectos || [],
    };
  } catch (error) {
    return request;
  }
}

export async function enrichRequestWithOrderLineItems(request, supplyOrderApi) {
  if (!request || !supplyOrderApi) {
    return request;
  }

  const orderId =
    request.supplyOrderId ||
    request._resolvedSupplyOrderId ||
    "";

  let linkedOrder = request._linkedSupplyOrder || null;

  if (orderId) {
    const fetchedOrder = await supplyOrderApi.fetchOrderById(orderId, {
      forceRefresh: true,
    });
    if (fetchedOrder) {
      linkedOrder = fetchedOrder;
    }
  }

  if (!linkedOrder) {
    return request;
  }

  const mappedOrder = mapSupplyOrderToSelection(linkedOrder);
  const orderDetails = getOrderDetails(linkedOrder);
  const proyectos = resolveRequestProyectos(request, mappedOrder);

  return {
    ...request,
    supplyOrderId: orderId || mappedOrder.supplyOrderId || "",
    supplierId:
      request.supplierId ||
      request._resolvedSupplierId ||
      mappedOrder.supplierId ||
      "",
    _resolvedSupplyOrderId:
      orderId || mappedOrder._resolvedSupplyOrderId || "",
    _resolvedSupplierId:
      request._resolvedSupplierId || mappedOrder._resolvedSupplierId || "",
    _linkedSupplyOrder: linkedOrder,
    details: orderDetails,
    proyectos,
    _hasOrderLineItems: hasOrderLineItems(linkedOrder),
    _hasSolicitudLineItems: hasSolicitudLineItems({ proyectos }),
  };
}

export function mapSupplyOrderToSelection(order) {
  if (!order) {
    return null;
  }

  const supplyOrderId = String(order.id || "").trim();
  const supplierId = resolveSupplierIdFromOrder(order);

  return {
    ...order,
    subdireccion: order.subdireccion || "",
    descripcionNecesidad:
      order.description || order.descripcionNecesidad || "",
    presupuestoDisponible:
      order.availableBudget != null
        ? order.availableBudget
        : order.presupuestoDisponible || 0,
    estado: order.status || order.estado || "APROBADO",
    supplyOrderId,
    supplierId,
    _resolvedSupplyOrderId: supplyOrderId,
    _resolvedSupplierId: supplierId,
    _linkedSupplyOrder: order,
    proyectos: (() => {
      const fromDetails = mapDetailsToProyectos(order);
      if (fromDetails.length) {
        return fromDetails;
      }
      return Array.isArray(order.proyectos) ? order.proyectos : [];
    })(),
  };
}

function scoreSupplyOrderMatch(request, order) {
  if (!request || !order) return 0;

  let score = 0;
  const requestSubdireccion = normalizeText(request.subdireccion);
  const orderSubdireccion = normalizeText(order.subdireccion);

  const requestId = String(request.id || "").trim();
  const orderId = String(order.id || "").trim();
  if (requestId && orderId && requestId === orderId) {
    score += 100;
  }

  const orderCode = String(order.code || "").trim();
  if (requestId && orderCode && requestId === orderCode) {
    score += 80;
  }

  if (requestSubdireccion && orderSubdireccion) {
    if (requestSubdireccion === orderSubdireccion) {
      score += 50;
    } else if (
      requestSubdireccion.includes(orderSubdireccion) ||
      orderSubdireccion.includes(requestSubdireccion)
    ) {
      score += 30;
    }
  }

  const requestPlanIds = extractPlanItemIds(request);
  const orderPlanIds = Array.isArray(order.planItems)
    ? order.planItems
        .flatMap((item) => [
          String((item && item.planItemId) || "").trim(),
          String((item && item.id) || "").trim(),
        ])
        .filter(Boolean)
    : [];

  if (requestPlanIds.length && orderPlanIds.length) {
    const overlap = requestPlanIds.filter((id) => orderPlanIds.includes(id));
    score += overlap.length * 20;
  }

  const requestDescription = normalizeText(request.descripcionNecesidad);
  const orderDescription = normalizeText(order.description);
  if (
    requestDescription &&
    orderDescription &&
    (requestDescription === orderDescription ||
      requestDescription.includes(orderDescription) ||
      orderDescription.includes(requestDescription))
  ) {
    score += 15;
  }

  const status = String(order.status || order.state || "").toUpperCase();
  if (status === "PENDING_SUPPLY") {
    score += 25;
  }

  return score;
}

export function resolveSupplyOrderLinkage(request, supplyOrders) {
  const orders = Array.isArray(supplyOrders) ? supplyOrders : [];
  const explicitSupplyOrderId =
    (request &&
      (request.supplyOrderId ||
        request.supply_order_id ||
        request.purchaseOrderSupplyId)) ||
    "";

  if (explicitSupplyOrderId) {
    const linkedOrder = orders.find((order) => order && order.id === explicitSupplyOrderId);
    return {
      supplyOrderId: explicitSupplyOrderId,
      supplierId:
        (request && (request.supplierId || request.proveedorId || request.proveedorNit)) ||
        resolveSupplierIdFromOrder(linkedOrder),
      linkedSupplyOrder: linkedOrder || null,
      matchScore: linkedOrder ? 100 : 0,
    };
  }

  let bestMatch = null;
  let bestScore = 0;

  orders.forEach((order) => {
    const score = scoreSupplyOrderMatch(request, order);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = order;
    }
  });

  if (!bestMatch || bestScore < 15) {
    return {
      supplyOrderId: "",
      supplierId:
        (request && (request.supplierId || request.proveedorId || request.proveedorNit)) ||
        "",
      linkedSupplyOrder: null,
      matchScore: 0,
    };
  }

  return {
    supplyOrderId: bestMatch.id || "",
    supplierId: resolveSupplierIdFromOrder(bestMatch),
    linkedSupplyOrder: bestMatch,
    matchScore: bestScore,
  };
}
