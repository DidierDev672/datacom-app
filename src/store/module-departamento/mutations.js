// Mutaciones generales

export function inicializarAccion (state) {
  state.departamento = {
    ...state.departamento,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.departamento = {
    ...state.departamento,
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

export function setListaDepartamentoSuccess (state, data) {
  state.departamento = {
    ...state.departamento,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaDepartamento (state) {
  state.departamento = {
    ...state.departamento,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setDepartamentoSuccess (state, data) {
  state.departamento = {
    ...state.departamento,
    objDepartamento: data,
    loading: false,
    loaded: true
  }
}
export function actualizarDepartamentoSuccess (state, data) {
  state.departamento.lista = state.departamento.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.departamento.loading = false
    state.departamento.loaded = true
}

export function agregarDepartamentoState (state, data) {
  state.departamento.lista.unshift(data)
}

export function unsetDepartamento (state) {
  state.departamento = {
    ...state.departamento,
    objDepartamento: {},
    loading: false,
    loaded: false
  }
}