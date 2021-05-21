export function getParametroState (state) {
  return state.parametros
}

export function getParametroPorId (state) {
  return function (id) {
    return state.parametros.lista.find(opt => opt.id === id)
  }
}
