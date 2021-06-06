export function getInfrasaludState (state) {
  return state.infrasalud
}

export function getInfrasaludPorId (state) {
  return function (id) {
    return state.infrasalud.lista.find(opt => opt.id === id)
  }
}
