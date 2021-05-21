// Mutaciones generales

export function inicializarAccion (state) {
  state.viviendas = {
    ...state.viviendas,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.viviendas = {
    ...state.viviendas,
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

export function setListaViviendasSuccess (state, data) {
  state.viviendas = {
    ...state.viviendas,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaViviendas (state) {
  state.viviendas = {
    ...state.viviendas,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setViviendaSuccess (state, data) {
  state.viviendas = {
    ...state.viviendas,
    objVivienda: data,
    loading: false,
    loaded: true
  }
}
export function actualizarViviendaSuccess (state, data) {
  state.viviendas.lista = state.viviendas.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.viviendas.loading = false
  state.viviendas.loaded = true
}

export function agregarViviendaState (state, data) {
  state.viviendas.lista.unshift(data)
}

export function unsetVivienda (state) {
  state.viviendas = {
    ...state.viviendas,
    objVivienda: {},
    loading: false,
    loaded: false
  }
}

export function eliminarCalidadDeVida (state, data) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    lista: state.calidad_de_vida.lista.filter(calidadDeVida => calidadDeVida.id !== data),
    loading: false,
    loaded: false
  }
}
