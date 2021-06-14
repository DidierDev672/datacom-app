// Mutaciones generales

export function inicializarAccion (state) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
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

export function setListaDetalleAutoevaluacionSuccess (state, data) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetLiDetalleAutoevaluacionJac (state) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setDetalleAutoevaluacionSuccess (state, data) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    objDetalleAutoevaluacion: data,
    loading: false,
    loaded: true
  }
}
export function actualizarDetalleAutoevaluacionSuccess (state, data) {
  state.detalleAutoevaluacion.lista = state.detalleAutoevaluacion.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.detalleAutoevaluacion.loading = false
  state.detalleAutoevaluacion.loaded = true
}

export function agregarDetalleAutoevaluacionState (state, data) {
  state.detalleAutoevaluacion.lista.unshift(data)
}

export function unsetDetalleAutoevaluacion (state) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    objDetalleAutoevaluacion: {},
    loading: false,
    loaded: false
  }
}

export function eliminarDetalleAutoevaluacion (state, data) {
  state.detalleAutoevaluacion = {
    ...state.detalleAutoevaluacion,
    lista: state.detalleAutoevaluacion.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
