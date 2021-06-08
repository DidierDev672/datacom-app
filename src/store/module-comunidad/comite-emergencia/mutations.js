// Mutaciones generales

export function inicializarAccion (state) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
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

export function setListaComiteEmergenciaSuccess (state, data) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaComiteEmergencia (state) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setComiteEmergenciaSuccess (state, data) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    objComiteEmergencia: data,
    loading: false,
    loaded: true
  }
}
export function actualizarComiteEmergenciaSuccess (state, data) {
  state.comiteEmergencia.lista = state.comiteEmergencia.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.comiteEmergencia.loading = false
  state.comiteEmergencia.loaded = true
}

export function agregarComiteEmergenciaState (state, data) {
  state.comiteEmergencia.lista.unshift(data)
}

export function unsetComiteEmergencia (state) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    objComiteEmergencia: {},
    loading: false,
    loaded: false
  }
}

export function eliminarComiteEmergencia (state, data) {
  state.comiteEmergencia = {
    ...state.comiteEmergencia,
    lista: state.comiteEmergencia.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
