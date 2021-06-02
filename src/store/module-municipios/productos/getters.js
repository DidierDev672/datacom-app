export function getProductoState (state) {
  return state.producto
}

export function getProductoPorId (state) {
  return function (id) {
    return state.producto.lista.find(opt => opt.id === id)
  }
}
