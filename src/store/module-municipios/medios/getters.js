export function getMedioState (state) {
  return state.medio
}

export function getMedioPorId (state) {
  return function (id) {
    return state.medio.lista.find(opt => opt.id === id)
  }
}
