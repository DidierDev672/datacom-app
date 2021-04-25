export function getCategoriaState (state) {
  return state.categoria
}

export function getCategoriaPorId (state) {
  return function (id) {
    return state.categoria.lstCategorias.find(categoria => categoria.id === id)
  }
}
