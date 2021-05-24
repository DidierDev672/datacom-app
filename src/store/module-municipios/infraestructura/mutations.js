// Mutaciones generales

export function inicializarAccion (state) {
  state.infInfraestructura = {
    ...state.infInfraestructura,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.infInfraestructura = {
    ...state.infInfraestructura,
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

export function setListaInfraestructuraSuccess (state, data) {
  state.infraestructura = {
    ...state.infraestructura,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaInfraestructura (state) {
  state.infraestructura = {
    ...state.infraestructura,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setInfraestructuraSuccess (state, data) {
  state.infraestructura = {
    ...state.infraestructura,
    objInfraestructura: data,
    loading: false,
    loaded: true
  }
}
export function actualizarInfraestructuraSuccess (state, data) {
  state.infraestructura.lista = state.infraestructura.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.infraestructura.loading = false
  state.infraestructura.loaded = true
}

export function agregarInfraestructuraState (state, data) {
  state.infraestructura.lista.unshift(data)
}

export function unsetInfraestructura (state) {
  state.infraestructura = {
    ...state.infraestructura,
    objInfraestructura: {},
    loading: false,
    loaded: false
  }
}

export function eliminarInfraestructura (state, data) {
  state.infraestructura = {
    ...state.infraestructura,
    lista: state.infraestructura.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
