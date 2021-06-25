// Mutaciones generales

export function inicializarAccion (state) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      loading: true,
      error: null
    }
  }

  export function setActionFail (state, payload) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
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

  export function setListaFichaViviendaSuccess (state, data) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      lista: data,
      loading: false,
      loaded: true
    }
  }

  export function unsetListaFichaVivienda (state) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      lista: [],
      loading: false,
      loaded: false,
      error: null
    }
  }

  // Mutaciones para el objeto categoria

  export function setFichaViviendaSuccess (state, data) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      objFichaVivienda: data,
      loading: false,
      loaded: true
    }
  }
  export function actualizarFichaViviendaSuccess (state, data) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      objFichaVivienda: data,
      loading: false,
      loaded: true
    }
  }

  export function agregarFichaViviendaState (state, data) {
    state.fichaVivienda.lista.push(data)
  }

  export function unsetFichaVivienda (state) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      objFichaVivienda: {},
      loading: false,
      loaded: false
    }
  }

  export function eliminarFichaVivienda (state, data) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      lista: state.fichaVivienda.lista.filter(opt => opt.id !== data),
      loading: false,
      loaded: false
    }
  }
