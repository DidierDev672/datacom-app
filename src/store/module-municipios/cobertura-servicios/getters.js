export function getCoberturaState (state) {
  return state.cobertura
}

export function getCoberturaPorId (state) {
  return function (id) {
    return state.cobertura.lista.find(opt => opt.id === id)
  }
}
