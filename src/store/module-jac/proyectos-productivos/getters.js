export function getProyectosProductivosState (state) {
  return state.proyectosProductivos
}
export function getProyectosProductivosPorId (state) {
  return function (id) {
    return state.proyectosProductivos.lista.find(opt => opt.id === id)
  }
}
