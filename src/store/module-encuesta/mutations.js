// Mutaciones generales

export function inicializarAccion (state) {
  state.encuesta = {
    ...state.encuesta,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.encuesta = {
    ...state.encuesta,
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

export function setListaEncuestaSuccess (state, data) {
  state.encuesta = {
    ...state.encuesta,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaEncuesta (state) {
  state.encuesta = {
    ...state.encuesta,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setEncuestaSuccess (state, data) {
  state.encuesta = {
    ...state.encuesta,
    objEncuesta: data,
    loading: false,
    loaded: true
  }
}
export function actualizarEncuestaSuccess (state, data) {
  state.encuesta.lista = state.encuesta.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.encuesta.loading = false
    state.encuesta.loaded = true
}

export function agregarEncuestaState (state, data) {
  state.encuesta.lista.unshift(data)
}

export function unsetEncuesta (state) {
  state.encuesta = {
    ...state.encuesta,
    objEncuesta: {},
    loading: false,
    loaded: false
  }
}

export function eliminarEncuesta (state, data) {
  state.encuesta = {
    ...state.encuesta,
    lista: state.encuesta.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
