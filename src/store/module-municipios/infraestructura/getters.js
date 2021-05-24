export function getInfraestructuraState (state) {
  return state.infraestructura
}

export function getInfraestructuraPorId (state) {
  return function (id) {
    return state.infraestructura.lista.find(opt => opt.id === id)
  }
}
