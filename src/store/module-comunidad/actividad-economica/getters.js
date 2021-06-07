export function getActividadEconomicaState (state) {
  return state.actividadEconomica
}

export function getActividadEconomicaPorId (state) {
  return function (id) {
    return state.actividadEconomica.lista.find(opt => opt.id === id)
  }
}
