// Mutaciones generales

export function inicializarAccion (state) {
  state.busquedas = {
    ...state.busquedas,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.busquedas = {
    ...state.busquedas,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

