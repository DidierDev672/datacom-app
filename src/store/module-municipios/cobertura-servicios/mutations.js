// Mutaciones generales

export function inicializarAccion (state) {
  state.cobertura = {
    ...state.cobertura,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.cobertura = {
    ...state.cobertura,
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

export function setListaCoberturaSuccess (state, data) {
  state.cobertura = {
    ...state.cobertura,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaCobertura (state) {
  state.cobertura = {
    ...state.cobertura,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setCoberturaSuccess (state, data) {
  state.cobertura = {
    ...state.cobertura,
    objCobertura: data,
    loading: false,
    loaded: true
  }
}
export function actualizarCoberturaSuccess (state, data) {
  state.cobertura.lista = state.cobertura.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.cobertura.loading = false
  state.cobertura.loaded = true
}

export function agregarCoberturaState (state, data) {
  state.cobertura.lista.unshift(data)
}

export function unsetCobertura (state) {
  state.cobertura = {
    ...state.cobertura,
    objCobertura: {},
    loading: false,
    loaded: false
  }
}

export function eliminarCobertura (state, data) {
  state.cobertura = {
    ...state.cobertura,
    lista: state.cobertura.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
