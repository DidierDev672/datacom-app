// Mutaciones generales

export function inicializarAccion (state) {
  state.reportesGenerales = {
    ...state.reportesGenerales,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.reportesGenerales = {
    ...state.reportesGenerales,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

// Mutaciones para la lista de reportes generales

export function setListaReportesGeneralesSuccess (state, data) {
  state.reportesGenerales = {
    ...state.reportesGenerales,
    lista: data,
    loading: false,
    loaded: true
  }
}
