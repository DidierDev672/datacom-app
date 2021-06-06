export function getViasState (state) {
  return state.vias
}

export function getViasPorId (state) {
  return function (id) {
    return state.vias.lista.find(opt => opt.id === id)
  }
}
