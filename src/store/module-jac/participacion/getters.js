export function getParticipacionState (state) {
  return state.participacion
}
export function getParticipacionPorId (state) {
  return function (id) {
    return state.participacion.lista.find(opt => opt.id === id)
  }
}
