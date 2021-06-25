// Mutaciones generales

export function inicializarAccion (state) {
  state.habilidades = {
    ...state.habilidades,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.habilidades = {
    ...state.habilidades,
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

export function setListaHabilidadesSuccess (state, data) {
  state.habilidades = {
    ...state.habilidades,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaHabilidades (state) {
  state.habilidades = {
    ...state.habilidades,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setHabilidadesSuccess (state, data) {
  state.habilidades = {
    ...state.habilidades,
    objHabilidades: data,
    loading: false,
    loaded: true
  }
}
export function actualizarHabilidadesSuccess (state, data) {
  state.habilidades.lista = state.habilidades.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.habilidades.loading = false
  state.habilidades.loaded = true
}

export function agregarHabilidadesState (state, data) {
  state.habilidades.lista.push(data)
}

export function unsetHabilidades (state) {
  state.habilidades = {
    ...state.habilidades,
    objHabilidades: {},
    loading: false,
    loaded: false
  }
}

export function eliminarHabilidades (state, data) {
  state.habilidades = {
    ...state.habilidades,
    lista: state.habilidades.lista.filter(habilidades => habilidades.id !== data),
    loading: false,
    loaded: false
  }
}
