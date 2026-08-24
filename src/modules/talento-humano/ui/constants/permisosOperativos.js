/**
 * Catálogo de permisos operativos (etiquetas en español).
 */
export const PERMISOS_OPERATIVOS = [
  {
    key: 'permisoCompras',
    label: 'Compras',
    description: 'Puede aprobar acciones relacionadas con compras',
    icon: 'shopping_cart',
    group: 'aprobacion'
  },
  {
    key: 'permisoAprobaciones',
    label: 'Aprobaciones',
    description: 'Puede aprobar solicitudes y flujos de aprobación',
    icon: 'fact_check',
    group: 'aprobacion'
  },
  {
    key: 'permisoCreacionUsuarios',
    label: 'Creación de usuarios',
    description: 'Puede autorizar la creación de usuarios en el sistema',
    icon: 'person_add',
    group: 'aprobacion'
  },
  {
    key: 'permisoEliminacionUsuarios',
    label: 'Eliminación de usuarios',
    description: 'Puede aprobar la eliminación de usuarios',
    icon: 'person_remove',
    group: 'eliminacion'
  },
  {
    key: 'permisoEliminacionCompras',
    label: 'Eliminación de compras',
    description: 'Puede aprobar la eliminación de registros de compras',
    icon: 'remove_shopping_cart',
    group: 'eliminacion'
  },
  {
    key: 'permisoEliminacionSolicitudes',
    label: 'Eliminación de solicitudes',
    description: 'Puede aprobar la eliminación de solicitudes',
    icon: 'delete_sweep',
    group: 'eliminacion'
  }
];

/**
 * Permisos de visibilidad para componentes del módulo de abastecimiento.
 */
export const PERMISOS_VISIBILIDAD = [
  {
    key: 'visibilidadCrearPlanAbastecimiento',
    label: 'Crear plan de abastecimiento',
    description: 'Permite ver el componente CrearPlanAbastecimiento.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'CrearPlanAbastecimiento.vue'
  },
  {
    key: 'visibilidadSupplyPlanTable',
    label: 'Lista de planes de abastecimiento',
    description: 'Permite ver el componente SupplyPlanTable.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'SupplyPlanTable.vue'
  },
  {
    key: 'visibilidadCrearRubros',
    label: 'Rubros — crear',
    description: 'Permite ver el componente CrearRubros.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'CrearRubros.vue'
  },
  {
    key: 'visibilidadBudgetCategoriasList',
    label: 'Rubros — lista de categorías',
    description: 'Permite ver el componente BudgetCategoriasList.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'BudgetCategoriasList.vue'
  },
  {
    key: 'visibilidadCrearRequisicionFormView',
    label: 'Requisición — crear solicitud',
    description: 'Permite ver el componente CrearRequisicionFormView.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'CrearRequisicionFormView.vue'
  },
  {
    key: 'visibilidadRequisicionesListView',
    label: 'Requisición — lista de solicitudes',
    description: 'Permite ver el componente RequisicionesListView.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'RequisicionesListView.vue'
  },
  {
    key: 'visibilidadGestionOrdenCompra',
    label: 'Compras — gestión de órdenes',
    description: 'Permite ver el componente GestionOrdenCompraView.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'GestionOrdenCompraView.vue'
  },
  {
    key: 'visibilidadTransaccionesCompra',
    label: 'Compras — lista de gestión de compras',
    description: 'Permite ver el componente PurchaseTransactionsListView.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'PurchaseTransactionsListView.vue'
  },
  {
    key: 'visibilidadComparacionProveedores',
    label: 'Cotizaciones — comparación de proveedores',
    description: 'Permite ver el componente SupplierComparisonView.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'SupplierComparisonView.vue'
  },
  {
    key: 'visibilidadComparacionesProveedores',
    label: 'Cotizaciones — lista de comparaciones',
    description: 'Permite ver el componente SupplierComparisonsList.vue',
    icon: 'visibility',
    group: 'visibilidad',
    componente: 'SupplierComparisonsList.vue'
  }
];

export function buildPermisosIniciales () {
  const state = {};
  PERMISOS_OPERATIVOS.forEach(function (p) {
    state[p.key] = false;
  });
  return state;
}

export function tieneAlgunPermiso (permisos) {
  return PERMISOS_OPERATIVOS.some(function (p) {
    return !!permisos[p.key];
  });
}

export function permisosFromRecord (record) {
  const state = buildPermisosIniciales();
  PERMISOS_OPERATIVOS.forEach(function (p) {
    if (record && record[p.key]) {
      state[p.key] = true;
    }
  });
  return state;
}

export function contarPermisosActivos (record) {
  return PERMISOS_OPERATIVOS.filter(function (p) {
    return record && !!record[p.key];
  }).length;
}

export function permisosActivosLabels (record) {
  return PERMISOS_OPERATIVOS.filter(function (p) {
    return record && !!record[p.key];
  }).map(function (p) {
    return p.label;
  });
}

/**
 * Combina varias asignaciones (p. ej. por departamento) en un solo mapa de flags.
 */
export function buildVisibilidadIniciales () {
  var state = {};
  PERMISOS_VISIBILIDAD.forEach(function (p) {
    state[p.key] = false;
  });
  return state;
}

export function mergeVisibilidadFromRecord (record) {
  var state = buildVisibilidadIniciales();
  if (!record) return state;
  PERMISOS_VISIBILIDAD.forEach(function (p) {
    if (record[p.key] === true) {
      state[p.key] = true;
    }
  });
  return state;
}

export function mergePermisosFromRecords (records) {
  const state = buildPermisosIniciales();
  if (!Array.isArray(records)) {
    return state;
  }
  PERMISOS_OPERATIVOS.forEach(function (p) {
    state[p.key] = records.some(function (r) {
      return r && !!r[p.key];
    });
  });
  return state;
}
