import { ACCEPTED_STATUSES } from "./purchaseOrderConstants";

export function shortId(id) {
  if (!id) return "—";
  return String(id).split("-")[0];
}

export function planLabel(request) {
  const planItems = request && request.planItems ? request.planItems : [];
  if (planItems.length) {
    const names = [
      ...new Set(
        planItems.map((item) => item && item.planItemDescription).filter(Boolean)
      ),
    ];
    if (names.length) {
      return names.join(", ");
    }
  }

  const proyectos = request && request.proyectos ? request.proyectos : [];
  if (!proyectos.length) return "";
  const names = [
    ...new Set(proyectos.map((p) => p.planAbastecimiento).filter(Boolean)),
  ];
  return names.join(", ");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function calculateSpentAmount(request) {
  if (!request) {
    return 0;
  }

  const details = Array.isArray(request.details) ? request.details : [];
  if (details.length) {
    return details.reduce((acc, detail) => {
      const quantity = Number(detail && detail.quantity) || 0;
      const unitPrice = Number(detail && detail.unitPrice) || 0;
      return acc + quantity * unitPrice;
    }, 0);
  }

  if (!Array.isArray(request.proyectos)) {
    return 0;
  }

  const total = request.proyectos.reduce((projectAcc, project) => {
    const products = Array.isArray(project.productosServicios)
      ? project.productosServicios
      : [];
    const projectTotal = products.reduce((productAcc, product) => {
      const quantity = Number(product && product.cantidad) || 0;
      const unitPrice = Number(product && product.valorUnitario) || 0;
      return productAcc + quantity * unitPrice;
    }, 0);
    return projectAcc + projectTotal;
  }, 0);

  return total > 0 ? total : 0;
}

export function calculateAllocatedBudget(request) {
  return Number(request && request.presupuestoDisponible) || 0;
}

export function calculateAvailableBalance(request) {
  const allocated = calculateAllocatedBudget(request);
  const spent = calculateSpentAmount(request);
  return allocated - spent;
}

export function isAcceptedStatus(estado) {
  return ACCEPTED_STATUSES.includes(String(estado || "").toUpperCase());
}
