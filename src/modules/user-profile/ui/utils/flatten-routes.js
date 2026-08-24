/**
 * Utilidades para trabajar con el árbol de rutas de vue-router.
 */

function buildFullPath(parentPath, routePath) {
  if (parentPath) {
    return (parentPath + "/" + routePath).replace(/\/+/g, "/");
  }
  return routePath || "";
}

/**
 * Aplana el árbol de rutas en un arreglo plano conservando `depth`.
 */
export function flattenRoutes(routes, depth, parentPath) {
  if (depth === undefined) depth = 0;
  if (parentPath === undefined) parentPath = "";

  return routes.reduce(function (rutasPlanas, ruta) {
    var fullPath = buildFullPath(parentPath, ruta.path);

    if (ruta.name) {
      rutasPlanas.push({
        name: ruta.name,
        path: fullPath || "/",
        depth: depth,
        meta: ruta.meta || {},
      });
    }

    if (ruta.children && ruta.children.length) {
      rutasPlanas.push.apply(
        rutasPlanas,
        flattenRoutes(ruta.children, depth + 1, fullPath)
      );
    }

    return rutasPlanas;
  }, []);
}

/**
 * Construye un árbol de rutas conservando `children` para acordeones.
 */
export function buildRouteTree(routes, depth, parentPath) {
  if (depth === undefined) depth = 0;
  if (parentPath === undefined) parentPath = "";

  var tree = [];

  routes.forEach(function (ruta) {
    var fullPath = buildFullPath(parentPath, ruta.path);
    var childNodes = [];

    if (ruta.children && ruta.children.length) {
      childNodes = buildRouteTree(ruta.children, depth + 1, fullPath);
    }

    if (ruta.name) {
      tree.push({
        name: ruta.name,
        path: fullPath || "/",
        depth: depth,
        meta: ruta.meta || {},
        children: childNodes,
      });
      return;
    }

    if (childNodes.length) {
      tree.push({
        name: null,
        label: ruta.path || fullPath || "Grupo",
        path: fullPath || "/",
        depth: depth,
        meta: ruta.meta || {},
        children: childNodes,
        isGroup: true,
      });
    }
  });

  return tree;
}

export function matchesRouteQuery(route, query) {
  var name = (route.name || route.label || "").toLowerCase();
  var path = (route.path || "").toLowerCase();
  var visibilidad = route.meta && route.meta.requiresVisibilidad
    ? String(route.meta.requiresVisibilidad).toLowerCase()
    : "";
  var roles = "";
  if (route.meta && route.meta.requiresRole && route.meta.requiresRole.length) {
    roles = route.meta.requiresRole.join(" ").toLowerCase();
  }

  return name.indexOf(query) !== -1
    || path.indexOf(query) !== -1
    || visibilidad.indexOf(query) !== -1
    || roles.indexOf(query) !== -1;
}

/**
 * Filtra el árbol de rutas conservando padres cuando algún hijo coincide.
 */
export function filterRouteTree(nodes, query) {
  if (!query) {
    return nodes;
  }

  var result = [];

  nodes.forEach(function (node) {
    var filteredChildren = filterRouteTree(node.children || [], query);
    var selfMatch = matchesRouteQuery(node, query);

    if (selfMatch || filteredChildren.length) {
      result.push({
        name: node.name,
        label: node.label,
        path: node.path,
        depth: node.depth,
        meta: node.meta,
        children: filteredChildren,
        isGroup: node.isGroup,
      });
    }
  });

  return result;
}

export function countRouteTree(nodes) {
  var count = 0;

  nodes.forEach(function (node) {
    count += 1;
    if (node.children && node.children.length) {
      count += countRouteTree(node.children);
    }
  });

  return count;
}

export function getRouteKey(route) {
  var namePart = route.name || route.label || "group";
  return (route.path || "/") + "|" + namePart;
}

export function collectAllDescendantKeys(node) {
  var keys = [getRouteKey(node)];

  if (node.children && node.children.length) {
    node.children.forEach(function (child) {
      keys.push.apply(keys, collectAllDescendantKeys(child));
    });
  }

  return keys;
}

export function collectSelectedRoutesFromTree(nodes, selectedKeys) {
  var selected = [];

  nodes.forEach(function (node) {
    var key = getRouteKey(node);
    if (selectedKeys[key]) {
      selected.push({
        name: node.name,
        label: node.label,
        path: node.path,
        meta: node.meta || {},
        isGroup: node.isGroup,
      });
    }

    if (node.children && node.children.length) {
      selected.push.apply(
        selected,
        collectSelectedRoutesFromTree(node.children, selectedKeys)
      );
    }
  });

  return selected;
}

export function buildSelectedKeysFromRoutes(routes) {
  var keys = {};

  (routes || []).forEach(function (route) {
    keys[getRouteKey(route)] = true;
  });

  return keys;
}

export function findRoutesByPaths(routes, paths) {
  var flat = flattenRoutes(routes);
  var result = [];

  (paths || []).forEach(function (path) {
    var found = flat.find(function (route) {
      return route.path === path;
    });

    if (found) {
      result.push(found);
      return;
    }

    result.push({
      path: path,
      name: path,
      meta: {},
    });
  });

  return result;
}
