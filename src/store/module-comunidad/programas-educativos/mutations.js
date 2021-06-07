// Mutaciones generales

export function inicializarAccion (state) {
  state.programasEducativos = {
    ...state.programasEducativos,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.programasEducativos = {
    ...state.programasEducativos,
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

export function setListaProgramasEducativosSuccess (state, data) {
  state.programasEducativos = {
    ...state.programasEducativos,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaProgramasEducativos (state) {
  state.programasEducativos = {
    ...state.programasEducativos,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setProgramasEducativosSuccess (state, data) {
  state.programasEducativos = {
    ...state.programasEducativos,
    objProgramasEducativos: data,
    loading: false,
    loaded: true
  }
}
export function actualizarProgramasEducativosSuccess (state, data) {
  state.programasEducativos.lista = state.programasEducativos.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.programasEducativos.loading = false
  state.programasEducativos.loaded = true
}

export function agregarProgramasEducativosState (state, data) {
  state.programasEducativos.lista.unshift(data)
}

export function unsetProgramasEducativos (state) {
  state.programasEducativos = {
    ...state.programasEducativos,
    objProgramasEducativos: {},
    loading: false,
    loaded: false
  }
}

export function eliminarProgramasEducativos (state, data) {
  state.programasEducativos = {
    ...state.programasEducativos,
    lista: state.programasEducativos.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
