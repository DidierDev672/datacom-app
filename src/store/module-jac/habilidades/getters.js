export function getHabilidadesState (state) {
  return state.habilidades
}
export function getHabilidadesPorId (state) {
  return function (id) {
    return state.habilidades.lista.find(opt => opt.id === id)
  }
}
