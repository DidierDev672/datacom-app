export function getPoblacionInfantilState (state) {
  return state.poblacionInfantil
}

export function getPoblacionInfantilPorId (state) {
  return function (id) {
    return state.poblacionInfantil.lista.find(opt => opt.id === id)
  }
}
