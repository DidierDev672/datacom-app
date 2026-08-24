import { formatCurrency } from "./purchaseOrderFinance";

export function formatComparisonDate(value) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function winnerLabel(comparison) {
  if (!comparison) {
    return "—";
  }
  if (comparison.hasMixedWinners) {
    return comparison.winnerName || "Varios proveedores";
  }
  if (comparison.winnerName) {
    return comparison.winnerNit
      ? `${comparison.winnerName} (${comparison.winnerNit})`
      : comparison.winnerName;
  }
  return "—";
}

export function matchesComparisonSearch(row, query) {
  if (!query || !query.trim()) {
    return true;
  }
  const needle = query.trim().toLowerCase();
  const fields = [
    row.code,
    row.id,
    row.requestId,
    row.supplyOrderId,
    row.requestLabel,
    row.winnerName,
    row.winnerNit,
  ];
  return fields.some(
    (field) => field && String(field).toLowerCase().includes(needle)
  );
}

export function comparisonTotalLabel(comparison) {
  return formatCurrency(comparison && comparison.winnerTotal);
}
