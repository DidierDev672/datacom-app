// Mutaciones generales

export function inicializarAccion(state) {
  state.productoVivienda = {
    ...state.productoVivienda,
    loading: true,
    error: null
  };
}

export function setActionFail(state, payload) {
  state.productoVivienda = {
    ...state.productoVivienda,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  };
}

// Mutaciones para la lista de categorias

export function setListaProductoViviendaSuccess(state, data) {
  state.productoVivienda = {
    ...state.productoVivienda,
    lista: data,
    loading: false,
    loaded: true
  };
}

export function unsetListaProductoVivienda(state) {
  state.productoVivienda = {
    ...state.productoVivienda,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  };
}

// Mutaciones para el objeto categoria

export function setProductoViviendaSuccess(state, data) {
  state.productoVivienda = {
    ...state.productoVivienda,
    objProductoVivienda: data,
    loading: false,
    loaded: true
  };
}
export function actualizarProductoViviendaSuccess(state, data) {
  state.productoVivienda.lista = state.productoVivienda.lista.map(opt => {
    return opt.id === data.id ? data : opt;
  });
  state.productoVivienda.objProductoVivienda = data;
  state.productoVivienda.loading = false;
  state.productoVivienda.loaded = true;
}

export function agregarProductoViviendaState(state, data) {
  state.productoVivienda.lista.unshift(data);
}

export function unsetProductoVivienda(state) {
  state.productoVivienda = {
    ...state.productoVivienda,
    objProductoVivienda: {},
    loading: false,
    loaded: false
  };
}

export function eliminarProductoVivienda(state, data) {
  state.productoVivienda = {
    ...state.productoVivienda,
    lista: state.productoVivienda.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  };
}
