// Mutaciones generales

export function inicializarAccion (state) {
  state.encuestasComunidad = {
    ...state.encuestasComunidad,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.encuestasComunidad = {
    ...state.encuestasComunidad,
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

export function setListaEncuestasComunidadSuccess (state, data) {
  state.encuestasComunidad = {
    ...state.encuestasComunidad,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaEncuestasComunidad (state) {
  state.encuestasComunidad = {
    ...state.encuestasComunidad,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}
