export function getComiteEmergenciaState (state) {
  return state.comiteEmergencia
}

export function getComiteEmergenciaPorId (state) {
  return function (id) {
    return state.comiteEmergencia.lista.find(opt => opt.id === id)
  }
}
