// Mutaciones generales

export function inicializarAccion (state) {
  state.categoria = {
    ...state.categoria,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.categoria = {
    ...state.categoria,
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

export function setListaCategoriasSuccess (state, data) {
  state.categoria = {
    ...state.categoria,
    lstCategorias: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaCategorias (state) {
  state.categoria = {
    ...state.categoria,
    lstCategorias: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setCategoriaSuccess (state, data) {
  state.categoria = {
    ...state.categoria,
    objCategoria: data,
    loading: false,
    loaded: true
  }
}
export function actualizarCategoriaSuccess (state, data) {
  state.categoria = {
    ...state.categoria,
    objCategoria: data,
    loading: false,
    loaded: true
  }
}

export function agregarCategoriaState (state, data) {
  state.categoria.lstCategorias.push(data)
}

export function unsetCategoria (state) {
  state.categoria = {
    ...state.categoria,
    objCategoria: {},
    loading: false,
    loaded: false
  }
}

export function eliminarCategoria (state, data) {
  state.categoria = {
    ...state.categoria,
    lstCategorias: state.categoria.lstCategoria.filter(categoria => categoria.id !== data),
    loading: false,
    loaded: false
  }
}
