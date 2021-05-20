// Mutaciones generales

export function inicializarAccion (state) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
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

export function setListaCalidadDeVidaSuccess (state, data) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaCalidadDeVida (state) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setCalidadDeVidaSuccess (state, data) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    objCalidadDeVida: data,
    loading: false,
    loaded: true
  }
}
export function actualizarCalidadDeVidaSuccess (state, data) {
  state.calidad_de_vida.lista = state.calidad_de_vida.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.calidad_de_vida.loading = false
    state.calidad_de_vida.loaded = true
}

export function agregarCalidadDeVidaState (state, data) {
  state.calidad_de_vida.lista.unshift(data)
}

export function unsetCalidadDeVida (state) {
  state.calidad_de_vida = {
    ...state.calidad_de_vida,
    objCalidadDeVida: {},
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
