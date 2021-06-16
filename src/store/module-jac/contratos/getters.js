export function getContratosState (state) {
  return state.contratos
}
export function getContratosPorId (state) {
  return function (id) {
    return state.contratos.lista.find(opt => opt.id === id)
  }
}
