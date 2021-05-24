// Mutaciones generales

export function inicializarAccion (state) {
  state.informacionGeneral = {
    ...state.informacionGeneral,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.informacionGeneral = {
    ...state.informacionGeneral,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

// Mutaciones para el objeto categoria

export function setInformacionGeneralSuccess (state, data) {
  state.informacionGeneral = {
    ...state.informacionGeneral,
    objInformacionGeneral: data,
    loading: false,
    loaded: true
  }
}

export function unsetInformacionGeneral (state) {
  state.informacionGeneral = {
    ...state.informacionGeneral,
    objInformacionGeneral: {},
    loading: false,
    loaded: false
  }
}
