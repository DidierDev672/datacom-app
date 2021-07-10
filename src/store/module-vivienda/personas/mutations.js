// Mutaciones generales

export function inicializarAccion (state) {
  state.persona = {
    ...state.persona,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.persona = {
    ...state.persona,
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

export function setListaPersonaSuccess (state, data) {
  state.persona = {
    ...state.persona,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPersona (state) {
  state.persona = {
    ...state.persona,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPersonaSuccess (state, data) {
  state.persona = {
    ...state.persona,
    objPersona: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPersonaSuccess (state, data) {
  state.persona.lista = state.persona.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.persona.objPersona = data
  state.persona.loading = false
  state.persona.loaded = true
}

export function agregarPersonaState (state, data) {
  state.persona.lista.unshift(data)
}

export function unsetPersona (state) {
  state.persona = {
    ...state.persona,
    objPersona: {},
    loading: false,
    loaded: false
  }
}

export function eliminarPersona (state, data) {
  state.persona = {
    ...state.persona,
    lista: state.persona.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
