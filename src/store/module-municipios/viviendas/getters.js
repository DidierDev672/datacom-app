export function getViviendaState (state) {
  return state.viviendas
}

export function getViviendaPorId (state) {
  return function (id) {
    return state.viviendas.lista.find(opt => opt.id === id)
  }
}
