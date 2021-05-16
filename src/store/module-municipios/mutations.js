// Mutaciones generales

export function inicializarAccion (state) {
    state.municipios = {
      ...state.municipios,
      loading: true,
      error: null
    }
  }
  
  export function setActionFail (state, payload) {
    state.municipios = {
      ...state.municipios,
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
  
  export function setListaMunicipiosSuccess (state, data) {
    state.municipios = {
      ...state.municipios,
      lista: data,
      loading: false,
      loaded: true
    }
  }
  
  export function unsetListaMunicipios (state) {
    state.municipios = {
      ...state.municipios,
      lista: [],
      loading: false,
      loaded: false,
      error: null
    }
  }
  
  // Mutaciones para el objeto categoria
  
  export function setMunicipioSuccess (state, data) {
    state.municipios = {
      ...state.municipios,
      municipio: data,
      loading: false,
      loaded: true
    }
  }
  export function actualizarMunicipioSuccess (state, data) {
    state.municipios = {
      ...state.municipios,
      municipio: data,
      loading: false,
      loaded: true
    }
  }
  
  export function agregarMunicipioState (state, data) {
    state.municipios.lista.push(data)
  }
  
  export function unsetMunicipio (state) {
    state.municipios = {
      ...state.municipios,
      municipio: {},
      loading: false,
      loaded: false
    }
  }
  
  export function eliminarMunicipio (state, data) {
    state.municipios = {
      ...state.municipios,
      lista: state.municipios.lista.filter(municipio => municipio.id !== data),
      loading: false,
      loaded: false
    }
  }

  export function setInformacionGeneralSuccess(state, payload){
    state.municipios.municipio.informacionGeneral = payload
  }
  