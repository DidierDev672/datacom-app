// Mutaciones generales

export function inicializarAccion (state) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
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

export function setListaProyectosProductivosSuccess (state, data) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaProyectosProductivos (state) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setProyectosProductosSuccess (state, data) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    objProyectosProductivos: data,
    loading: false,
    loaded: true
  }
}
export function actualizarProyectosProductivosSuccess (state, data) {
  state.proyectosProductivos.lista = state.proyectosProductivos.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.proyectosProductivos.loading = false
  state.proyectosProductivos.loaded = true
}

export function agregarProyectoProductivosState (state, data) {
  state.proyectosProductivos.lista.push(data)
}

export function unsetProyectosProductivos (state) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    objProyectosProductivos: {},
    loading: false,
    loaded: false
  }
}

export function eliminarProyectosProductivos (state, data) {
  state.proyectosProductivos = {
    ...state.proyectosProductivos,
    lista: state.proyectosProductivos.lista.filter(proyectosProductivos => proyectosProductivos.id !== data),
    loading: false,
    loaded: false
  }
}
