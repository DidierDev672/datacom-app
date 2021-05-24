// Mutaciones generales

export function inicializarAccion (state) {
  state.seguridad = {
    ...state.seguridad,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.seguridad = {
    ...state.seguridad,
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

export function setListaSeguridadSuccess (state, data) {
  state.seguridad = {
    ...state.seguridad,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaSeguridad (state) {
  state.seguridad = {
    ...state.seguridad,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setSeguridadSuccess (state, data) {
  state.seguridad = {
    ...state.seguridad,
    objSeguridad: data,
    loading: false,
    loaded: true
  }
}
export function actualizarSeguridadSuccess (state, data) {
  state.seguridad.lista = state.seguridad.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.seguridad.loading = false
  state.seguridad.loaded = true
}

export function agregarSeguridadState (state, data) {
  state.seguridad.lista.unshift(data)
}

export function unsetSeguridad (state) {
  state.seguridad = {
    ...state.seguridad,
    objSeguridad: {},
    loading: false,
    loaded: false
  }
}

export function eliminarSeguridad (state, data) {
  state.seguridad = {
    ...state.seguridad,
    lista: state.seguridad.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
