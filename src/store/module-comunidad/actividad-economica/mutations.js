// Mutaciones generales

export function inicializarAccion (state) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
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

export function setListaActividadEconomicaSuccess (state, data) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    listaActividadEconomica: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaActividadEconomica (state) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setActividadEconomicaSuccess (state, data) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    objActividadEconomica: data,
    loading: false,
    loaded: true
  }
}
export function actualizarActividadEconomicaSuccess (state, data) {
  state.actividadEconomica.lista = state.actividadEconomica.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.actividadEconomica.loading = false
  state.actividadEconomica.loaded = true
}

export function agregarActividadEconomicaState (state, data) {
  state.actividadEconomica.lista.unshift(data)
}

export function unsetActividadEconomica (state) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    objActividadEconomica: {},
    loading: false,
    loaded: false
  }
}

export function eliminarActividadEconomica (state, data) {
  state.actividadEconomica = {
    ...state.actividadEconomica,
    lista: state.actividadEconomica.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
