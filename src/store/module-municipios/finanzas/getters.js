export function getFinanzaState (state) {
  return state.infraestructura
}

export function getFinanzaPorId (state) {
  return function (id) {
    return state.finanza.lista.find(opt => opt.id === id)
  }
}
