export function getTerritorioState (state) {
  return state.territorio
}

export function getTerritorioPorId (state) {
  return function (id) {
    return state.territorio.lista.find(opt => opt.id === id)
  }
}
