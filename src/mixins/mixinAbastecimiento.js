/**
 * Recorre el menú de abastecimiento y aplica el estado de visibilidad/bloqueo
 * según los permisos del usuario en sesión.
 *
 * - Si algún bloqueo de visibilidad está en true (tieneVisibilidadActiva),
 *   cada ítem con `visibilidadKey` recibe `visible: true|false` según
 *   cumpla la condición del componente (accessStore.puedeVer).
 * - Los ítems bloqueados permanecen en el menú con `bloqueado: true`.
 * - Si no hay bloqueos activos, los ítems con visibilidadKey quedan visibles.
 * - Los ítems sin rol requerido por la ruta se excluyen del menú.
 */

function estaBloqueadoPorRol(routeName, router, accessStore) {
  var rutaResuelta = router.resolve({ name: routeName });
  var route = rutaResuelta.route || rutaResuelta;
  var matched = route.matched || [];
  var i;

  for (i = 0; i < matched.length; i++) {
    var record = matched[i];
    var rolesRequeridos =
      record.meta && record.meta.requiresRole ? record.meta.requiresRole : null;

    if (
      rolesRequeridos &&
      typeof accessStore.hasRole === "function" &&
      !accessStore.hasRole(rolesRequeridos)
    ) {
      return true;
    }
  }

  return false;
}

function aplicarEstadoVisibilidad(item, accessStore) {
  var itemCopy = Object.assign({}, item);

  if (!item.visibilidadKey) {
    return itemCopy;
  }

  if (accessStore.tieneVisibilidadActiva) {
    itemCopy.visible = accessStore.puedeVer(item.visibilidadKey);
  } else {
    itemCopy.visible = false;
  }

  itemCopy.bloqueado = !itemCopy.visible;
  return itemCopy;
}

export function filtrarMenu(items, options) {
  var router = options.router;
  var accessStore = options.accessStore;
  var visibles = [];

  if (!items || !items.length) {
    return visibles;
  }

  items.forEach(function (item) {
    var hijosFiltrados = null;

    if (item.children && item.children.length) {
      hijosFiltrados = filtrarMenu(item.children, options);
      if (hijosFiltrados.length === 0) {
        return;
      }
    }

    if (item.routeName !== undefined && item.routeName !== null) {
      if (estaBloqueadoPorRol(item.routeName, router, accessStore)) {
        return;
      }
    }

    var itemCopy = aplicarEstadoVisibilidad(item, accessStore);

    if (hijosFiltrados) {
      itemCopy.children = hijosFiltrados;
    }

    visibles.push(itemCopy);
  });

  return visibles;
}

export function filterMenu(items, options) {
  return filtrarMenu(items, options);
}
