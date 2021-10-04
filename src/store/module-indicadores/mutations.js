// Mutaciones generales

export function inicializarAccion(state) {
  state.indicadores = {
    ...state.indicadores,
    loading: true,
    error: null
  };
}

export function setActionFail(state, payload) {
  state.indicadores = {
    ...state.indicadores,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  };
}

// Mutaciones para la lista de ico

export function setListaIndicadoresSuccess(state, data) {
  state.indicadores = {
    ...state.indicadores,
    lista: data,
    loading: false,
    loaded: true
  };
}
