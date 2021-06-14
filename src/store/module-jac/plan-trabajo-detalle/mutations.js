// Mutaciones generales

export function inicializarAccion (state) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    loading: false,
    loaded: false,
    error: {
      status: payload.status,
      statusText: payload.statusText,
      message: payload.data.message
    }
  }
}

// Mutaciones para la lista Plan de Trabajo

export function setListaPlanTrabajoDetalleSuccess (state, data) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPlanTrabajoDetalle (state) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPlanTrabajoDetalleSuccess (state, data) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    objPlanTrabajoDetalle: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPlanTrabajoDetalleSuccess (state, data) {
  state.planTrabajoDetalle.lista = state.planTrabajoDetalle.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.planTrabajoDetalle.loading = false
  state.planTrabajoDetalle.loaded = true
}

export function agregarPlanTrabajoDetalleState (state, data) {
  state.planTrabajoDetalle.lista.unshift(data)
}

export function unsetPlanTrabajoDetalle (state) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    objPlanTrabajoDetalle: {},
    loading: false,
    loaded: false
  }
}

export function eliminarPlanTrabajoDetalle (state, data) {
  state.planTrabajoDetalle = {
    ...state.planTrabajoDetalle,
    lista: state.planTrabajoDetalle.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
