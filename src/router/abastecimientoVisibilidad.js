/**
 * Mapa único entre ítems del menú de AbastecimientoLayout y meta.requiresVisibilidad.
 * Fuente de verdad para el guard y las rutas del módulo.
 */
export const ABASTECIMIENTO_VISIBILIDAD_POR_RUTA = {
  "Crear-plan-abastecimiento": "visibilidadCrearPlanAbastecimiento",
  "lista-planes-abastecimiento": "visibilidadSupplyPlanTable",
  "crear-rubros": "visibilidadCrearRubros",
  "editar-rubros": "visibilidadCrearRubros",
  "lista-categorias-presupuesto": "visibilidadBudgetCategoriasList",
  "crear-solicitud-abastecimiento": "visibilidadCrearRequisicionFormView",
  "lista-solicitudes-abastecimiento": "visibilidadRequisicionesListView",
};

export function resolveVisibilidadKeyForRoute(route) {
  if (!route) return null;

  var meta = route.meta || {};
  if (meta.requiresVisibilidad) {
    return meta.requiresVisibilidad;
  }

  if (route.name && ABASTECIMIENTO_VISIBILIDAD_POR_RUTA[route.name]) {
    return ABASTECIMIENTO_VISIBILIDAD_POR_RUTA[route.name];
  }

  return null;
}

export function resolveVisibilidadKeyForRouteName(routeName) {
  if (!routeName) return null;
  return ABASTECIMIENTO_VISIBILIDAD_POR_RUTA[routeName] || null;
}
