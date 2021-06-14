// Mutaciones generales

export function inicializarAccion (state) {
  state.contratos = {
    ...state.contratos,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.contratos = {
    ...state.contratos,
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

export function setListaContratosSuccess (state, data) {
  state.contratos = {
    ...state.contratos,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaCotratos (state) {
  state.contratos = {
    ...state.contratos,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setContratosSuccess (state, data) {
  state.contratos = {
    ...state.contratos,
    objContratos: data,
    loading: false,
    loaded: true
  }
}
export function actualizarContratosSuccess (state, data) {
  state.contratos = {
    ...state.contratos,
    objContratos: data,
    loading: false,
    loaded: true
  }
}

export function agregarContratosState (state, data) {
  state.contratos.lista.push(data)
}

export function unsetContratos (state) {
  state.contratos = {
    ...state.contratos,
    objContratos: {},
    loading: false,
    loaded: false
  }
}

export function eliminarContratos (state, data) {
  state.contratos = {
    ...state.contratos,
    lista: state.contratos.lista.filter(contratos => contratos.id !== data),
    loading: false,
    loaded: false
  }
}
