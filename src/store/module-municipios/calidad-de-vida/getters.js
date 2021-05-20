export function getCalidadDeVidaState (state) {
  return state.calidad_de_vida
}

export function getCalidadDeVidaPorId (state) {
  return function (id) {
    return state.calidad_de_vida.lista.find(opt => opt.id === id)
  }
}
