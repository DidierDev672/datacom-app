// Mutaciones generales

export function inicializarAccion (state) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
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

export function setListaPoblacionInfantilSuccess (state, data) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPoblacionInfantil (state) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPoblacionInfantilSuccess (state, data) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    objPoblacionInfantil: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPoblacionInfantilSuccess (state, data) {
  state.poblacionInfantil.lista = state.poblacionInfantil.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.poblacionInfantil.loading = false
  state.poblacionInfantil.loaded = true
}

export function agregarPoblacionInfantilState (state, data) {
  state.poblacionInfantil.lista.unshift(data)
}

export function unsetPoblacionInfantil (state) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    objPoblacionInfantil: {},
    loading: false,
    loaded: false
  }
}

export function eliminarPoblacionInfantil (state, data) {
  state.poblacionInfantil = {
    ...state.poblacionInfantil,
    lista: state.poblacionInfantil.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
