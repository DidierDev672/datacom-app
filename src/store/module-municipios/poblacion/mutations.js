// Mutaciones generales

export function inicializarAccion (state) {
    state.poblacion = {
      ...state.poblacion,
      loading: true,
      error: null
    }
  }
  
  export function setActionFail (state, payload) {
    state.poblacion = {
      ...state.poblacion,
      loading: false,
      loaded: false,
      error: {
        status: payload.status,
        statusText: payload.statusText,
        message: payload.data.message
      }
    }
  }  

  // Mutaciones para la lista

  export function setListaPoblacionSuccess(state, data){
    state.poblacion = {
      ...state.poblacion,
      lista: data,
      loading: false,
      loaded: true
    }
  }

  export function unsetListaPoblacion (state) {
    state.poblacion = {
      ...state.poblacion,
      lista: [],
      loading: false,
      loaded: false,
      error: null
    }
  }

  // Mutaciones para el objeto

  export function setPoblacionSuccess(state, payload){
    state.poblacion.lista.unshift(payload)
    state.poblacion.loading = false
    state.poblacion.loaded = true
  }