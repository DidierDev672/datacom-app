// Mutaciones generales

export function inicializarAccion (state) {
  state.infrasalud = {
    ...state.infrasalud,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.infrasalud = {
    ...state.infrasalud,
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

export function setListaInfrasaludSuccess (state, data) {
  state.infrasalud = {
    ...state.infrasalud,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaInfrasalud (state) {
  state.infrasalud = {
    ...state.infrasalud,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setInfrasaludSuccess (state, data) {
  state.infrasalud = {
    ...state.infrasalud,
    objInfrasalud: data,
    loading: false,
    loaded: true
  }
}
export function actualizarInfrasaludSuccess (state, data) {
  state.infrasalud.lista = state.infrasalud.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.infrasalud.loading = false
  state.infrasalud.loaded = true
}

export function agregarInfrasaludState (state, data) {
  state.infrasalud.lista.unshift(data)
}

export function unsetInfrasalud (state) {
  state.infrasalud = {
    ...state.infrasalud,
    objInfrasalud: {},
    loading: false,
    loaded: false
  }
}

export function eliminarInfrasalud (state, data) {
  state.infrasalud = {
    ...state.infrasalud,
    lista: state.infrasalud.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
