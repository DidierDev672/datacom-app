export function getTipoEncuestaState (state) {
  return state.tipoEncuesta
}

export function getTipoEncuestaPorId (state) {
  return function (id) {
    return state.tipoEncuesta.lista.find(opt => opt.id === id)
  }
}
