// Mutaciones generales

export function inicializarAccion (state) {
  state.participacion = {
    ...state.participacion,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.participacion = {
    ...state.participacion,
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

export function setListaParticipacionSuccess (state, data) {
  state.participacion = {
    ...state.participacion,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaParticipacion (state) {
  state.participacion = {
    ...state.participacion,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setParticipacionSuccess (state, data) {
  state.participacion = {
    ...state.participacion,
    objParticipacion: data,
    loading: false,
    loaded: true
  }
}
export function actualizarParticipacionSuccess (state, data) {
  state.participacion = {
    ...state.participacion,
    objParticipacion: data,
    loading: false,
    loaded: true
  }
}

export function agregarParticipacionState (state, data) {
  state.participacion.lista.push(data)
}

export function unsetParticipacion (state) {
  state.participacion = {
    ...state.participacion,
    objParticipacion: {},
    loading: false,
    loaded: false
  }
}

export function eliminarParticipacion (state, data) {
  state.participacion = {
    ...state.participacion,
    lista: state.participacion.lista.filter(participacion => participacion.id !== data),
    loading: false,
    loaded: false
  }
}
