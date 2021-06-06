// Mutaciones generales

export function inicializarAccion (state) {
  state.ecosistema = {
    ...state.ecosistema,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.ecosistema = {
    ...state.ecosistema,
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

export function setListaEcosistemaSuccess (state, data) {
  state.ecosistema = {
    ...state.ecosistema,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaEcosistema (state) {
  state.ecosistema = {
    ...state.ecosistema,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setEcosistemaSuccess (state, data) {
  state.ecosistema = {
    ...state.ecosistema,
    objEcosistema: data,
    loading: false,
    loaded: true
  }
}
export function actualizarEcosistemaSuccess (state, data) {
  state.ecosistema.lista = state.ecosistema.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.ecosistema.loading = false
  state.ecosistema.loaded = true
}

export function agregarEcosistemaState (state, data) {
  state.ecosistema.lista.unshift(data)
}

export function unsetEcosistema (state) {
  state.ecosistema = {
    ...state.ecosistema,
    objEcosistema: {},
    loading: false,
    loaded: false
  }
}

export function eliminarEcosistema (state, data) {
  state.ecosistema = {
    ...state.ecosistema,
    lista: state.ecosistema.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
