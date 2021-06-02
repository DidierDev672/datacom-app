// Mutaciones generales

export function inicializarAccion (state) {
  state.indicador = {
    ...state.indicador,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.indicador = {
    ...state.indicador,
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

export function setListaIndicadorSuccess (state, data) {
  state.indicador = {
    ...state.indicador,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaIndicador (state) {
  state.indicador = {
    ...state.indicador,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setIndicadorSuccess (state, data) {
  state.indicador = {
    ...state.indicador,
    objIndicador: data,
    loading: false,
    loaded: true
  }
}
export function actualizarIndicadorSuccess (state, data) {
  state.indicador.lista = state.indicador.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.indicador.loading = false
  state.indicador.loaded = true
}

export function agregarIndicadorState (state, data) {
  state.indicador.lista.unshift(data)
}

export function unsetIndicador (state) {
  state.indicador = {
    ...state.indicador,
    objIndicador: {},
    loading: false,
    loaded: false
  }
}