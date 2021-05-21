// Mutaciones generales

export function inicializarAccion (state) {
  state.secretarias = {
    ...state.secretarias,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.secretarias = {
    ...state.secretarias,
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

export function setListaSecretariaSuccess (state, data) {
  state.secretarias = {
    ...state.secretarias,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaSecretaria (state) {
  state.secretarias = {
    ...state.secretarias,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setSecretariaSuccess (state, data) {
  state.secretarias = {
    ...state.secretarias,
    objSecretaria: data,
    loading: false,
    loaded: true
  }
}
export function actualizarSecretariaSuccess (state, data) {
  state.secretarias.lista = state.secretarias.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.secretarias.loading = false
  state.secretarias.loaded = true
}

export function agregarSecretariaState (state, data) {
  state.secretarias.lista.unshift(data)
}

export function unsetSecretaria (state) {
  state.secretarias = {
    ...state.secretarias,
    objSecretaria: {},
    loading: false,
    loaded: false
  }
}

export function eliminarSecretaria (state, data) {
  state.secretarias = {
    ...state.secretarias,
    lista: state.secretarias.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
