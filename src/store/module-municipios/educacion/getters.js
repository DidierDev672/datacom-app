export function getEducacionState (state) {
  return state.educacion
}

export function getEducacionPorId (state) {
  return function (id) {
    return state.educacion.lista.find(opt => opt.id === id)
  }
}
