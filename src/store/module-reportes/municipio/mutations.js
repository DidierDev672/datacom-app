// Mutaciones generales

export function inicializarAccion(state) {
    state.encuesta = {
        ...state.encuesta,
        loading: true,
        error: null,
    };
}

export function setActionFail(state, payload) {
    state.encuesta = {
        ...state.encuesta,
        loading: false,
        loaded: false,
        error: {
            status: payload.status,
            statusText: payload.statusText,
            message: payload.data.message,
        },
    };
}

// Mutaciones para el objeto categoria

export function setChartdataSuccess(state, data) {
    state.chartdata = {
        ...state.chartdata,
        labels: Object.keys(data.poblacionRango),
        datasets: [
            {
                label: 'Mi grafico',
                backgroundColor: '#64c2c8',
                data: Object.values(data.poblacionRango),
            },
        ],
    };
}
