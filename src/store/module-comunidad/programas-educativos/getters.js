export function getProgramasEducativosState (state) {
  return state.programasEducativos
}

export function getProgramasEducativosPorId (state) {
  return function (id) {
    return state.programasEducativos.lista.find(opt => opt.id === id)
  }
}
