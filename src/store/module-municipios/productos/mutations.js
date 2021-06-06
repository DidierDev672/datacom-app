// Mutaciones generales

export function inicializarAccion (state) {
  state.producto = {
    ...state.producto,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.producto = {
    ...state.producto,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

// Mutaciones para la lista de categorias

export function setListaProductoSuccess (state, data) {
  state.producto = {
    ...state.producto,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaProducto (state) {
  state.producto = {
    ...state.producto,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setProductoSuccess (state, data) {
  state.producto = {
    ...state.producto,
    objProducto: data,
    loading: false,
    loaded: true
  }
}
export function actualizarProductoSuccess (state, data) {
  state.producto.lista = state.producto.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.producto.loading = false
  state.producto.loaded = true
}

export function agregarProductoState (state, data) {
  state.producto.lista.unshift(data)
}

export function unsetProducto (state) {
  state.producto = {
    ...state.producto,
    objProducto: {},
    loading: false,
    loaded: false
  }
}

export function eliminarProducto (state, data) {
  state.producto = {
    ...state.producto,
    lista: state.producto.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
