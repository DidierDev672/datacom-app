/**
 * Opciones de selección para departamentos laborales registrados.
 */

export function normalizeDepartmentsList (departments) {
  return Array.isArray(departments) ? departments : [];
}

export function formatDepartmentLabel (department) {
  if (!department) {
    return '';
  }
  var name = department.name || department.nombre || ('Departamento ' + department.id);
  var code = department.code ? ' · ' + department.code : '';
  var areas = Array.isArray(department.areas) ? department.areas.length : 0;
  var areasHint = areas > 0 ? ' — ' + areas + ' área(s)' : '';
  var status =
    department.status && department.status !== 'ACTIVO'
      ? ' (' + department.status + ')'
      : '';
  return name + code + areasHint + status;
}

export function buildDepartmentSelectOptions (departments) {
  return normalizeDepartmentsList(departments)
    .slice()
    .sort(function (a, b) {
      var nameA = String(a.name || a.nombre || '').toLowerCase();
      var nameB = String(b.name || b.nombre || '').toLowerCase();
      return nameA.localeCompare(nameB, 'es');
    })
    .map(function (department) {
      return {
        value: department.id,
        label: formatDepartmentLabel(department),
        raw: department
      };
    })
    .filter(function (option) {
      return option.value != null;
    });
}

export function getDepartmentAreaNames (department) {
  var names = [];
  if (!department) {
    return names;
  }
  var deptName = department.name || department.nombre;
  if (deptName) {
    names.push(String(deptName).trim().toLowerCase());
  }
  if (department.code) {
    names.push(String(department.code).trim().toLowerCase());
  }
  var areas = Array.isArray(department.areas) ? department.areas : [];
  areas.forEach(function (area) {
    var areaName = area && (area.name || area.areaName || area.nombre || area.title);
    if (areaName) {
      names.push(String(areaName).trim().toLowerCase());
    }
    var areaCode = area && (area.areaCode || area.code);
    if (areaCode) {
      names.push(String(areaCode).trim().toLowerCase());
    }
  });
  return names;
}
