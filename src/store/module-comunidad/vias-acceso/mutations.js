// Mutaciones generales

export function inicializarAccion (state) {
  state.vias = {
    ...state.vias,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.vias = {
    ...state.vias,
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

export function setListaViasSuccess (state, data) {
  state.vias = {
    ...state.vias,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaVias (state) {
  state.vias = {
    ...state.vias,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setViasSuccess (state, data) {
  state.vias = {
    ...state.vias,
    objVias: data,
    loading: false,
    loaded: true
  }
}
export function actualizarViasSuccess (state, data) {
  state.vias.lista = state.vias.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.vias.loading = false
  state.vias.loaded = true
}

export function agregarViasState (state, data) {
  state.vias.lista.unshift(data)
}

export function unsetVias (state) {
  state.vias = {
    ...state.vias,
    objVias: {},
    loading: false,
    loaded: false
  }
}

export function eliminarVias (state, data) {
  state.vias = {
    ...state.vias,
    lista: state.vias.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
