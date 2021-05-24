export function getEncuestaState (state) {
  return state.encuesta
}

export function getEncuestaPorId (state) {
  return function (id) {
    return state.encuesta.lista.find(opt => opt.id === id)
  }
}
