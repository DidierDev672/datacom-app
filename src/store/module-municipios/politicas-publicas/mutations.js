// Mutaciones generales

export function inicializarAccion (state) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
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

export function setListaPoliticasPublicasSuccess (state, data) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPoliticasPublicas (state) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPoliticasPublicasSuccess (state, data) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    objPoliticasPublicas: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPoliticasPublicasSuccess (state, data) {
  state.politicasPublicas.lista = state.politicasPublicas.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.politicasPublicas.loading = false
  state.politicasPublicas.loaded = true
}

export function agregarPoliticasPublicasState (state, data) {
  state.politicasPublicas.lista.unshift(data)
}

export function unsetPoliticasPublicas (state) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    objPoliticasPublicas: {},
    loading: false,
    loaded: false
  }
}

export function eliminarPoliticasPublicas (state, data) {
  state.politicasPublicas = {
    ...state.politicasPublicas,
    lista: state.politicasPublicas.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
