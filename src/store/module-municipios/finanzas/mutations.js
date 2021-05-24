// Mutaciones generales

export function inicializarAccion (state) {
  state.finanza = {
    ...state.finanza,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.finanza = {
    ...state.finanza,
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

export function setListaFinanzaSuccess (state, data) {
  state.finanza = {
    ...state.finanza,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaFinanza (state) {
  state.finanza = {
    ...state.finanza,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setFinanzaSuccess (state, data) {
  state.finanza = {
    ...state.finanza,
    objFinanza: data,
    loading: false,
    loaded: true
  }
}
export function actualizarFinanzaSuccess (state, data) {
  state.finanza.lista = state.finanza.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.finanza.loading = false
  state.finanza.loaded = true
}

export function agregarFinanzaState (state, data) {
  state.finanza.lista.unshift(data)
}

export function unsetFinanza (state) {
  state.finanza = {
    ...state.finanza,
    objFinanza: {},
    loading: false,
    loaded: false
  }
}

export function eliminarFinanza (state, data) {
  state.finanza = {
    ...state.finanza,
    lista: state.finanza.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
