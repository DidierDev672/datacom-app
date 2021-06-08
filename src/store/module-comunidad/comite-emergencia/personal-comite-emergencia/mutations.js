// Mutaciones generales

export function inicializarAccion (state) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
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

export function setListaPersonalComiteEmergenciaSuccess (state, data) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPersonalComiteEmergencia (state) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPersonalComiteEmergenciaSuccess (state, data) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
    objPersonalComiteEmergencia: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPersonalComiteEmergenciaSuccess (state, data) {
  state.personalComiteEmergencia.lista = state.personalComiteEmergencia.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.personalComiteEmergencia.loading = false
  state.personalComiteEmergencia.loaded = true
}

export function agregarPersonalComiteEmergenciaState (state, data) {
  state.personalComiteEmergencia.lista.unshift(data)
}

export function unsetPersonalComiteEmergencia (state) {
  state.personalComiteEmergencia = {
    ...state.personalComiteEmergencia,
    objPersonalComiteEmergencia: {},
    loading: false,
    loaded: false
  }
}


