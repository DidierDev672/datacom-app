export function getPoliticasPublicasState (state) {
  return state.politicasPublicas
}

export function getPoliticasPublicasPorId (state) {
  return function (id) {
    return state.politicasPublicas.lista.find(opt => opt.id === id)
  }
}
