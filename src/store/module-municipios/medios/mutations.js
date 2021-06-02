// Mutaciones generales

export function inicializarAccion (state) {
  state.medio = {
    ...state.medio,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.medio = {
    ...state.medio,
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

export function setListaMedioSuccess (state, data) {
  state.medio = {
    ...state.medio,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaMedio (state) {
  state.medio = {
    ...state.medio,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setMedioSuccess (state, data) {
  state.medio = {
    ...state.medio,
    objMedio: data,
    loading: false,
    loaded: true
  }
}
export function actualizarMedioSuccess (state, data) {
  state.medio.lista = state.medio.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.medio.loading = false
  state.medio.loaded = true
}

export function agregarMedioState (state, data) {
  state.medio.lista.unshift(data)
}

export function unsetMedio (state) {
  state.medio = {
    ...state.medio,
    objMedio: {},
    loading: false,
    loaded: false
  }
}

export function eliminarMedio (state, data) {
  state.medio = {
    ...state.medio,
    lista: state.medio.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
