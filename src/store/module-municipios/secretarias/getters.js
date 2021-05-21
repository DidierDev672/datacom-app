export function getSecretariaState (state) {
  return state.secretarias
}

export function getSecretariaPorId (state) {
  return function (id) {
    return state.secretarias.lista.find(opt => opt.id === id)
  }
}
