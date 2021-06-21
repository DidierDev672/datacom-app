// Mutaciones generales

export function inicializarAccion (state) {
  state.datosVivienda = {
    ...state.datosVivienda,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.datosVivienda = {
    ...state.datosVivienda,
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

// export function setListaDatosViviendaSuccess (state, data) {
//   state.datosVivienda = {
//     ...state.datosVivienda,
//     lista: data,
//     loading: false,
//     loaded: true
//   }
// }

// export function unsetListaDatosVivienda (state) {
//   state.datosVivienda = {
//     ...state.datosVivienda,
//     lista: [],
//     loading: false,
//     loaded: false,
//     error: null
//   }
// }

// Mutaciones para el objeto categoria

export function setDatosViviendaSuccess (state, data) {
  state.datosVivienda = {
    ...state.datosVivienda,
    objDatosVivienda: data,
    loading: false,
    loaded: true
  }
}
export function actualizarDatosViviendaSuccess (state, data) {
  state.datosVivienda.lista = state.datosVivienda.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.datosVivienda.objDatosVivienda = data
  state.datosVivienda.loading = false
  state.datosVivienda.loaded = true
}

export function agregarDatosViviendaState (state, data) {
  state.datosVivienda.lista.unshift(data)
}

export function unsetDatosVivienda (state) {
  state.datosVivienda = {
    ...state.datosVivienda,
    objDatosVivienda: {},
    loading: false,
    loaded: false
  }
}

export function eliminarDatosVivienda (state, data) {
  state.datosVivienda = {
    ...state.datosVivienda,
    lista: state.datosVivienda.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
