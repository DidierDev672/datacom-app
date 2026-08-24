/**
 * Resuelve códigos o IDs de área al nombre legible para listados y formularios.
 */

function addLookupKey(map, key, displayName) {
  if (!map || !key || !displayName) {
    return;
  }
  const normalized = String(key).trim().toLowerCase();
  if (!normalized || map.has(normalized)) {
    return;
  }
  map.set(normalized, displayName);
}

/**
 * @param {Array<{ id?: *, code?: string, areaCode?: string, name?: string, areaName?: string }>} items
 * @returns {Map<string, string>}
 */
export function buildAreaLookup(items) {
  const map = new Map();
  (items || []).forEach(function (item) {
    if (!item) {
      return;
    }
    const name =
      (item.name && String(item.name).trim()) ||
      (item.areaName && String(item.areaName).trim()) ||
      "";
    if (!name) {
      return;
    }
    const keys = [item.id, item.code, item.areaCode];
    keys.forEach(function (key) {
      if (key != null && String(key).trim()) {
        addLookupKey(map, key, name);
      }
    });
    addLookupKey(map, name, name);
  });
  return map;
}

/**
 * @param {Array} departments - respuesta de GET /api/v1/departments
 * @returns {Map<string, string>}
 */
export function buildAreaLookupFromDepartments(departments) {
  const catalog = [];
  (departments || []).forEach(function (department) {
    if (!department) {
      return;
    }
    const deptName =
      (department.name && String(department.name).trim()) ||
      (department.nombre && String(department.nombre).trim()) ||
      "";
    if (deptName) {
      catalog.push({
        id: department.id,
        code: department.code,
        name: deptName,
      });
    }
    const areas = Array.isArray(department.areas) ? department.areas : [];
    areas.forEach(function (area) {
      const name =
        (area &&
          (area.name || area.areaName || area.nombre || area.title)) ||
        "";
      if (!name) {
        return;
      }
      catalog.push({
        id: area && (area.id || area.areaId),
        code: area && (area.areaCode || area.code),
        name: name,
      });
    });
  });
  return buildAreaLookup(catalog);
}

/**
 * @returns {Map<string, string>}
 */
export function buildAreaLookupFromWorkspaceRegistry() {
  try {
    const raw = localStorage.getItem("workspaces_registry");
    if (!raw) {
      return new Map();
    }
    const rows = JSON.parse(raw);
    if (!Array.isArray(rows)) {
      return new Map();
    }
    return buildAreaLookup(
      rows.map(function (row, index) {
        return {
          id: row.areaCode || "workspace-" + index,
          code: row.areaCode,
          name: row.areaName || "",
        };
      })
    );
  } catch (e) {
    return new Map();
  }
}

/**
 * @param {string|number|null|undefined} raw
 * @param {Map<string, string>} lookup
 * @returns {string}
 */
export function resolveLaborAreaDisplay(raw, lookup) {
  if (raw == null) {
    return "";
  }
  const value = String(raw).trim();
  if (!value) {
    return "";
  }
  const key = value.toLowerCase();
  if (lookup && lookup.has(key)) {
    return lookup.get(key);
  }
  if (/^\d+$/.test(value)) {
    return "";
  }
  return value;
}
