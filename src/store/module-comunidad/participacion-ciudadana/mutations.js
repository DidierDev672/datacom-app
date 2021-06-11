// Mutaciones generales

export function inicializarAccion (state) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
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

export function setListaParticipacionCiudadanaSuccess (state, data) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaParticipacionCiudadana (state) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setParticipacionCiudadanaSuccess (state, data) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    objParticipacionCiudadana: data,
    loading: false,
    loaded: true
  }
}
export function actualizarParticipacionCiudadanaSuccess (state, data) {
  state.participacionCiudadana.lista = state.participacionCiudadana.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.participacionCiudadana.loading = false
  state.participacionCiudadana.loaded = true
}

export function agregarParticipacionCiudadanaState (state, data) {
  state.participacionCiudadana.lista.unshift(data)
}

export function unsetParticipacionCiudadana (state) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    objParticipacionCiudadana: {},
    loading: false,
    loaded: false
  }
}

export function eliminarParticipacionCiudadana (state, data) {
  state.participacionCiudadana = {
    ...state.participacionCiudadana,
    lista: state.participacionCiudadana.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
