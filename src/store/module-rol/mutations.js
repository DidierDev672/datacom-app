// Mutaciones generales

export function inicializarAccion(state) {
  state.rol = {
    ...state.rol,
    loading: true,
    error: null
  };
}

export function setActionFail(state, payload) {
  state.rol = {
    ...state.rol,
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

export function setListaRolSuccess(state, data) {
  state.rol = {
    ...state.rol,
    lista: data,
    loading: false,
    loaded: true
  };
}

export function unsetListaRol(state) {
  state.rol = {
    ...state.rol,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  };
}
