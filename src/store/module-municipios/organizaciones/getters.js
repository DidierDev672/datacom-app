export function getOrganizacionState (state) {
  return state.organizacion
}

export function getOrganizacionPorId (state) {
  return function (id) {
    return state.organizacion.lista.find(opt => opt.id === id)
  }
}
