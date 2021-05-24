// Mutaciones generales

export function inicializarAccion (state) {
  state.organizacion = {
    ...state.organizacion,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.organizacion = {
    ...state.organizacion,
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

export function setListaOrganizacionSuccess (state, data) {
  state.organizacion = {
    ...state.organizacion,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaOrganizacion (state) {
  state.organizacion = {
    ...state.organizacion,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setOrganizacionSuccess (state, data) {
  state.organizacion = {
    ...state.organizacion,
    objOrganizacion: data,
    loading: false,
    loaded: true
  }
}
export function actualizarOrganizacionSuccess (state, data) {
  state.organizacion.lista = state.organizacion.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.organizacion.loading = false
  state.organizacion.loaded = true
}

export function agregarOrganizacionState (state, data) {
  state.organizacion.lista.unshift(data)
}

export function unsetOrganizacion (state) {
  state.organizacion = {
    ...state.organizacion,
    objOrganizacion: {},
    loading: false,
    loaded: false
  }
}

export function eliminarOrganizacion (state, data) {
  state.organizacion = {
    ...state.organizacion,
    lista: state.organizacion.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
