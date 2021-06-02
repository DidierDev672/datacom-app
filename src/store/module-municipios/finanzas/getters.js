export function getFinanzaState (state) {
  return state.finanza
}

export function getFinanzaPorId (state) {
  return function (id) {
    return state.finanza.lista.find(opt => opt.id === id)
  }
}
