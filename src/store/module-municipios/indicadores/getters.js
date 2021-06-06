export function getIndicadorState (state) {
  return state.indicador
}

export function getIndicadorPorId (state) {
  return function (id) {
    return state.indicador.lista.find(opt => opt.id === id)
  }
}
