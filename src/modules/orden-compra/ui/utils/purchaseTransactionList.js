export const TRANSACTION_STATUS_LABELS = {
  QUOTING: "En cotización",
  PENDING_ISSUE: "Pendiente generación",
  SENT_TO_SUPPLIER: "Enviada a proveedor",
  PARTIALLY_RECEIVED: "Recibido parcialmente",
  CLOSED: "Cerrada",
  REJECTED: "Rechazada",
};

export const TRANSACTION_STATUS_COLORS = {
  QUOTING: "blue-grey-7",
  PENDING_ISSUE: "orange-8",
  SENT_TO_SUPPLIER: "primary",
  PARTIALLY_RECEIVED: "teal-7",
  CLOSED: "positive",
  REJECTED: "negative",
};

export function transactionStatusLabel(status) {
  const key = String(status || "").toUpperCase();
  return TRANSACTION_STATUS_LABELS[key] || status || "Registrada";
}

export function transactionStatusColor(status) {
  const key = String(status || "").toUpperCase();
  return TRANSACTION_STATUS_COLORS[key] || "grey-7";
}

export function calculateTransactionTotal(transaction) {
  if (!transaction) {
    return 0;
  }

  if (transaction.totalAmount != null) {
    return Number(transaction.totalAmount) || 0;
  }

  const items = Array.isArray(transaction.items) ? transaction.items : [];
  return items.reduce((acc, item) => {
    const quantity = Number(item && item.quantity) || 0;
    const unitPrice = Number(item && item.unitPrice) || 0;
    return acc + quantity * unitPrice;
  }, 0);
}

export function transactionSupplierLabel(transaction) {
  if (!transaction) {
    return "—";
  }

  const supplier = transaction.supplier || {};
  return (
    supplier.name ||
    supplier.contactName ||
    transaction.supplierId ||
    "—"
  );
}

export function formatTransactionDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-CO");
}

export function matchesTransactionSearch(transaction, searchTerm) {
  const needle = String(searchTerm || "").toLowerCase().trim();
  if (!needle) {
    return true;
  }

  const fields = [
    transaction.code,
    transaction.id,
    transaction.supplyOrderId,
    transaction.assignedToUserId,
    transaction.createdByUserId,
    transaction.supplierId,
    transactionSupplierLabel(transaction),
    transactionStatusLabel(transaction.status),
  ];

  return fields.some((field) =>
    String(field || "")
      .toLowerCase()
      .includes(needle)
  );
}
