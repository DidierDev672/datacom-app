// Mutaciones generales

export function inicializarAccion (state) {
  state.territorio = {
    ...state.territorio,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.territorio = {
    ...state.territorio,
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

export function setListaTerritorioSuccess (state, data) {
  state.erritorio = {
    ...state.erritorio,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaTerritorio (state) {
  state.erritorio = {
    ...state.erritorio,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setTerritorioSuccess (state, data) {
  state.territorio = {
    ...state.territorio,
    objTerritorio: data,
    loading: false,
    loaded: true
  }
}
export function actualizarTerritorioSuccess (state, data) {
  state.territorio.lista = state.territorio.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.territorio.loading = false
  state.territorio.loaded = true
}

export function agregarTerritorioState (state, data) {
  state.territorio.lista.unshift(data)
}

export function unsetTerritorio (state) {
  state.territorio = {
    ...state.territorio,
    objTerritorio: {},
    loading: false,
    loaded: false
  }
}