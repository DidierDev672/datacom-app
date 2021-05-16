// Mutaciones generales

export function inicializarAccion (state) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      loading: true,
      error: null
    }
  }
  
  export function setActionFail (state, payload) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
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
  
  export function setListaFichaViviendaSuccess (state, data) {
    state.fichaVivienda = {
      ...state.fichaVivienda,
      lstViviendas: data,
      loading: false,
      loaded: true
    }
  }
  
  export function unsetListaCategorias (state) {
    state.categoria = {
      ...state.categoria,
      lstCategorias: [],
      loading: false,
      loaded: false,
      error: null
    }
  }
  
  // Mutaciones para el objeto categoria
  
  export function setCategoriaSuccess (state, data) {
    state.categoria = {
      ...state.categoria,
      objCategoria: data,
      loading: false,
      loaded: true
    }
  }
  export function actualizarCategoriaSuccess (state, data) {
    state.categoria = {
      ...state.categoria,
      objCategoria: data,
      loading: false,
      loaded: true
    }
  }
  
  export function agregarCategoriaState (state, data) {
    state.categoria.lstCategorias.push(data)
  }
  
  export function unsetCategoria (state) {
    state.categoria = {
      ...state.categoria,
      objCategoria: {},
      loading: false,
      loaded: false
    }
  }
  
  export function eliminarCategoria (state, data) {
    state.categoria = {
      ...state.categoria,
      lstCategorias: state.categoria.lstCategoria.filter(categoria => categoria.id !== data),
      loading: false,
      loaded: false
    }
  }
  