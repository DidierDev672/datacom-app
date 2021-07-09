// Mutaciones generales

export function inicializarAccion(state) {
  state.usuario = {
    ...state.usuario,
    loading: true,
    error: null
  };
}

export function setActionFail(state, payload) {
  state.usuario = {
    ...state.usuario,
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

export function setListaUsuarioSuccess(state, data) {
  state.usuario = {
    ...state.usuario,
    lista: data,
    loading: false,
    loaded: true
  };
}

export function unsetListaUsuario(state) {
  state.usuario = {
    ...state.usuario,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  };
}

// Mutaciones para el objeto categoria

export function setUsuarioSuccess(state, data) {
  state.usuario = {
    ...state.usuario,
    objUsuario: data,
    loading: false,
    loaded: true
  };
}
export function actualizarUsuarioSuccess(state, data) {
  state.usuario.lista = state.usuario.lista.map(opt => {
    return opt.id === data.id ? data : opt;
  });
  state.usuario.loading = false;
  state.usuario.loaded = true;
}

export function agregarUsuarioState(state, data) {
  state.usuario.lista.unshift(data);
}

export function unsetUsuario(state) {
  state.usuario = {
    ...state.usuario,
    objUsuario: {},
    loading: false,
    loaded: false
  };
}

export function eliminarUsuario(state, data) {
  state.usuario = {
    ...state.usuario,
    lista: state.usuario.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  };
}
