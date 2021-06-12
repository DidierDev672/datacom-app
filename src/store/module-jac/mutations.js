// Mutaciones generales

export function inicializarAccion (state) {
  state.jac = {
    ...state.jac,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.jac = {
    ...state.jac,
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

export function setListaJacSuccess (state, data) {
  state.jac = {
    ...state.jac,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaJac (state) {
  state.jac = {
    ...state.jac,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setJacSuccess (state, data) {
  state.jac = {
    ...state.jac,
    objJac: data,
    loading: false,
    loaded: true
  }
}
export function actualizarJacSuccess (state, data) {
  state.jac.lista = state.jac.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.jac.loading = false
  state.jac.loaded = true
}

export function agregarJacState (state, data) {
  state.jac.lista.unshift(data)
}

export function unsetJac (state) {
  state.jac = {
    ...state.jac,
    objJac: {},
    loading: false,
    loaded: false
  }
}

export function eliminarJac (state, data) {
  state.jac = {
    ...state.jac,
    lista: state.jac.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
