// Mutaciones generales

export function inicializarAccion(state) {
    state.reportesIcos = {
        ...state.reportesIcos,
        loading: true,
        error: null,
    };
}

export function setActionFail(state, payload) {
    state.reportesIcos = {
        ...state.reportesIcos,
        loading: false,
        loaded: false,
        error: {
            status: payload.status,
            statusText: payload.statusText,
            message: payload.data.message,
        },
    };
}
