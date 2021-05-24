// Mutaciones generales

export function inicializarAccion (state) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
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

export function setListaTipoEncuestaSuccess (state, data) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaTipoEncuesta (state) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setTipoEncuestaSuccess (state, data) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    objTipoEncuesta: data,
    loading: false,
    loaded: true
  }
}
export function actualizarTipoEncuestaSuccess (state, data) {
  state.tipoEncuesta.lista = state.tipoEncuesta.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.tipoEncuesta.loading = false
    state.tipoEncuesta.loaded = true
}

export function agregarTipoEncuestaState (state, data) {
  state.tipoEncuesta.lista.unshift(data)
}

export function unsetTipoEncuesta (state) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    objTipoEncuesta: {},
    loading: false,
    loaded: false
  }
}

export function eliminarTipoEncuesta (state, data) {
  state.tipoEncuesta = {
    ...state.tipoEncuesta,
    lista: state.tipoEncuesta.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
