// Mutaciones generales

export function inicializarAccion (state) {
    state.comunidad = {
      ...state.comunidad,
      loading: true,
      error: null
    }
  }
  
  export function setActionFail (state, payload) {
    state.comunidad = {
      ...state.comunidad,
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
  
  export function setListaComunidadSuccess (state, data) {
    state.comunidad = {
      ...state.comunidad,
      lista: data,
      loading: false,
      loaded: true
    }
  }
  
  export function unsetListaComunidad (state) {
    state.comunidad = {
      ...state.comunidad,
      lista: [],
      loading: false,
      loaded: false,
      error: null
    }
  }
  
  // Mutaciones para el objeto categoria
  
  export function setComunidadSuccess (state, data) {
    state.comunidad = {
      ...state.comunidad,
      objComunidad: data,
      loading: false,
      loaded: true
    }
  }
  export function actualizarComunidadSuccess (state, data) {
    state.comunidad = {
      ...state.comunidad,
      municipio: data,
      loading: false,
      loaded: true
    }
  }
  
  export function agregarComunidadState (state, data) {
    state.comunidad.lista.push(data)
  }
  
  export function unsetComunidad (state) {
    state.comunidad = {
      ...state.comunidad,
      objComunidad: {},
      loading: false,
      loaded: false
    }
  }
  
  export function eliminarComunidad (state, data) {
    state.comunidad = {
      ...state.comunidad,
      lista: state.comunidad.lista.filter(comunidad => comunidad.id !== data),
      loading: false,
      loaded: false
    }
  }  