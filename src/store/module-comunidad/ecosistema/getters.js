export function getEcosistemaState (state) {
  return state.ecosistema
}

export function getEcosistemaPorId (state) {
  return function (id) {
    return state.ecosistema.lista.find(opt => opt.id === id)
  }
}
