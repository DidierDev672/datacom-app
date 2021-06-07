export function getParticipacionCiudadanaState (state) {
  return state.participacionCiudadana
}

export function getParticipacionCiudadanaPorId (state) {
  return function (id) {
    return state.participacionCiudadana.lista.find(opt => opt.id === id)
  }
}
