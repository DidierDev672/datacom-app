export function getJuntaDirectivaState (state) {
  return state.juntaDirectiva
}
export function getJuntaDirectivaPorId (state) {
  return function (id) {
    return state.juntaDirectiva.lista.find(opt => opt.id === id)
  }
}
