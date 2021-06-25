// Mutaciones generales

export function inicializarAccion (state) {
  state.jacInfo = {
    ...state.jacInfo,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.jacInfo = {
    ...state.jacInfo,
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

export function setListaJacInfoSuccess (state, data) {
  state.jacInfo = {
    ...state.jacInfo,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaJacInfo (state) {
  state.jacInfo = {
    ...state.jacInfo,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setJacInfoSuccess (state, data) {
  state.jacInfo = {
    ...state.jacInfo,
    objJacInfo: data,
    loading: false,
    loaded: true
  }
}
export function actualizarJacInfoSuccess (state, data) {
  state.jacInfo.lista = state.jacInfo.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.jacInfo.loading = false
  state.jacInfo.loaded = true
}

export function agregarJacInfoState (state, data) {
  state.jacInfo.lista.push(data)
}

export function unsetJacInfo (state) {
  state.jacInfo = {
    ...state.jacInfo,
    objJacInfo: {},
    loading: false,
    loaded: false
  }
}

export function eliminarHabilidades (state, data) {
  state.jacInfo = {
    ...state.jacInfo,
    lista: state.jacInfo.lista.filter(jacInfo => jacInfo.id !== data),
    loading: false,
    loaded: false
  }
}
