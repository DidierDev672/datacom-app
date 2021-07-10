export function getJuntaDirectivaState (state) {
  return state.juntaDirectiva
}

export function getComites (state) {
  return state.juntaDirectiva.lista.filter(opt => opt.tipo.id === 247)
}

export function getJuntaDirectiva (state) {
  return state.juntaDirectiva.lista.filter(opt => opt.tipo.id === 246)
}

export function getJuntaDirectivaPorId (state) {
  return function (id) {
    return state.juntaDirectiva.lista.find(opt => opt.id === id)
  }
}
