// Mutaciones generales

export function inicializarAccion (state) {
  state.educacion = {
    ...state.educacion,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.educacion = {
    ...state.educacion,
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

export function setListaEducacionSuccess (state, data) {
  state.educacion = {
    ...state.educacion,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaEducacion (state) {
  state.educacion = {
    ...state.educacion,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setEducacionSuccess (state, data) {
  state.educacion = {
    ...state.educacion,
    objEducacion: data,
    loading: false,
    loaded: true
  }
}
export function actualizarEducacionSuccess (state, data) {
  state.educacion.lista = state.educacion.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.educacion.loading = false
  state.educacion.loaded = true
}

export function agregarEducacionState (state, data) {
  state.educacion.lista.unshift(data)
}

export function unsetEducacion (state) {
  state.educacion = {
    ...state.educacion,
    objEducacion: {},
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
