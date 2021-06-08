export function getPersonalComiteEmergenciaState (state) {
  return state.personalComiteEmergencia
}

export function getPersonalComiteEmergenciaPorId (state) {
  return function (id) {
    return state.personalComiteEmergencia.lista.find(opt => opt.id === id)
  }
}
