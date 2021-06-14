// Mutaciones generales

export function inicializarAccion (state) {
  state.planTrabajo = {
    ...state.planTrabajo,
    loading: true,
    error: null
  }
}

export function setActionFail (state, payload) {
  state.planTrabajo = {
    ...state.planTrabajo,
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

export function setListaPlanTrabajoSuccess (state, data) {
  state.planTrabajo = {
    ...state.planTrabajo,
    lista: data,
    loading: false,
    loaded: true
  }
}

export function unsetListaPlanTrabajo (state) {
  state.planTrabajo = {
    ...state.planTrabajo,
    lista: [],
    loading: false,
    loaded: false,
    error: null
  }
}

// Mutaciones para el objeto categoria

export function setPlanTrabajoSuccess (state, data) {
  state.planTrabajo = {
    ...state.planTrabajo,
    objPlanTrabajo: data,
    loading: false,
    loaded: true
  }
}
export function actualizarPlanTrabajoSuccess (state, data) {
  state.planTrabajo.lista = state.planTrabajo.lista.map(opt => {
    return opt.id === data.id ? data : opt
  })
  state.planTrabajo.loading = false
  state.planTrabajo.loaded = true
}

export function agregarPlanTrabajoState (state, data) {
  state.planTrabajo.lista.unshift(data)
}

export function unsetPlanTrabajo (state) {
  state.planTrabajo = {
    ...state.planTrabajo,
    objPlanTrabajo: {},
    loading: false,
    loaded: false
  }
}

export function eliminarPlanTrabajo (state, data) {
  state.planTrabajo = {
    ...state.planTrabajo,
    lista: state.planTrabajo.lista.filter(opt => opt.id !== data),
    loading: false,
    loaded: false
  }
}
