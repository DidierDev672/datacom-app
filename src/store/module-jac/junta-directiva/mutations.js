// Mutaciones generales

export function inicializarAccion (state) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
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

export function setListaJuntaDirectivaSuccess (state, data) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaJuntaDirectiva (state) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setJuntaDirectivaSuccess (state, data) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    objJuntaDirectiva: data,
    loading: false,
    loaded: true
  }
}
export function actualizarJuntaDirectivaSuccess (state, data) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    objJuntaDirectiva: data,
    loading: false,
    loaded: true
  }
}

export function agregarJuntaDirectivaState (state, data) {
  state.juntaDirectiva.lista.push(data)
}

export function unsetJuntaDirectiva (state) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    objJuntaDirectiva: {},
    loading: false,
    loaded: false
  }
}

export function eliminarJuntaDirectiva (state, data) {
  state.juntaDirectiva = {
    ...state.juntaDirectiva,
    lista: state.juntaDirectiva.lista.filter(juntaDirectiva => juntaDirectiva.id !== data),
    loading: false,
    loaded: false
  }
}
