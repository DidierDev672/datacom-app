// Mutaciones generales

export function inicializarAccion(state) {
  state.ico = {
    ...state.ico,
    loading: true,
    error: null
  };
}

export function setActionFail(state, payload) {
  state.ico = {
    ...state.ico,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  };
}

// Mutaciones para la lista de ico

export function setListaIcoSuccess(state, data) {
  state.ico = {
    ...state.ico,
    lista: data,
    loading: false,
    loaded: true
  };
}

// Mutaciones para el objeto ico

export function setIcoSuccess(state, data) {
  state.ico = {
    ...state.ico,
    objIco: data,
    loading: false,
    loaded: true
  };
}

export function addIcoStateSuccess(state, data) {
  console.log("Mutacion: ", data);
  state.ico.lista.unshift(data);
}

export function actualizarIcoSuccess(state, data) {
  console.log("Mutacion: ", data);
  state.ico.lista = state.ico.lista.map(opt => {
    return opt.id === data.id ? data : opt;
  });
  state.ico.loading = false;
  state.ico.loaded = true;
}
