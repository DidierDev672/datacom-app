export function isAbastecimientoTalentoHumanoContext(route) {
  const name = String((route && route.name) || "");
  const path = String((route && route.path) || "");
  return (
    name.indexOf("abastecimiento") >= 0 ||
    path.indexOf("/abastecimiento/talento-humano") >= 0 ||
    path.indexOf("/abastecimiento/contabilidad") >= 0
  );
}

export function talentoHumanoRouteNames(route) {
  const abastecimiento = isAbastecimientoTalentoHumanoContext(route);

  if (abastecimiento) {
    return {
      listaEmpleados: "abastecimiento-lista-empleados",
      employeeBasicData: "abastecimiento-employee-basic-data",
      departamentosLista: "abastecimiento-departamentos-lista",
      departamentoCreate: "abastecimiento-departamento-create",
      departamentoView: "abastecimiento-departamento-view",
      departamentoEdit: "abastecimiento-departamento-edit",
      colaboradorPermisosCreate: "abastecimiento-colaborador-permisos-create",
      crearUsuarioSistema: "abastecimiento-crear-usuario-sistema",
    };
  }

  return {
    listaEmpleados: "lista-empleados",
    employeeBasicData: "employee-basic-data",
    departamentosLista: "departamentos-lista",
    departamentoCreate: "departamento-create",
    departamentoView: "departamento-view",
    departamentoEdit: "departamento-edit",
    colaboradorPermisosCreate: "colaborador-permisos-create",
    crearUsuarioSistema: "crear-usuario-sistema",
  };
}

export function departamentoViewTo(route, id) {
  const names = talentoHumanoRouteNames(route);
  return { name: names.departamentoView, params: { id } };
}

export function departamentoEditTo(route, id) {
  const names = talentoHumanoRouteNames(route);
  return { name: names.departamentoEdit, params: { id } };
}
