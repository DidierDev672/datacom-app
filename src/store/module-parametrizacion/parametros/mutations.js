// Mutaciones generales

export function inicializarAccion (state) {
  state.parametros = {
    ...state.parametros,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.parametros = {
    ...state.parametros,
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

export function setListaParametroSuccess (state, data) {
  state.parametros = {
    ...state.parametros,
    lista: data,
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
export function setParametroSuccess (state, data) {
  console.log("establecio success")
  state.parametros = {
    ...state.parametros,
    objParametro: data,
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

export function agregarParametroState (state, data) {
  state.parametros.lista.push(data)
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
