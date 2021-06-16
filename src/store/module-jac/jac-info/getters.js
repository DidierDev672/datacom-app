export function getJacInfoState (state) {
  return state.jacInfo
}
export function getJacInfoPorId (state) {
  return function (id) {
    return state.jacInfo.lista.find(opt => opt.id === id)
  }
}
