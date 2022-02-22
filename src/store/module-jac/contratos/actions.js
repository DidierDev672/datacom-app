import axios from 'axios';
import { URL_API } from '../../../utils/config';

// Acciones para la lista
export function cargarListaContratosAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'contratos';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/jac/${payload}`)
            .then(({ data }) => {
                commit('setListaContratosSuccess', data);
                resolve(data);
            })
            .catch((error) => {
                console.log(
                    'Ocurrió un error al consultar los tipos de encuestas: ',
                    error.response
                );
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function unsetListaContratosAction({ commit }) {
    commit('unsetListaContratos');
}

// Acciones para un objeto Calidad De Vida

export function buscarContratosAction({ commit }, encuestaID) {
    commit('inicializarAccion');

    const urlService = 'contratos';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${encuestaID}`)
            .then(({ data }) => {
                commit('setContratosSuccess', data);
                resolve(data);
            })
            .catch((error) => {
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function registrarContratosAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'contratos';
    return new Promise((resolve, reject) => {
        axios
            .post(`${URL_API}/${urlService}/`, payload)
            .then(({ data }) => {
                let info = {
                    ...payload,
                    id: data,
                };
                commit('setContratosSuccess', info);
                commit('agregarContratosState', info);
                resolve(data);
            })
            .catch((error) => {
                console.log('Error al guardar: ', error);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function actualizarContratosAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'contratos';
    return new Promise((resolve, reject) => {
        axios
            .put(`${URL_API}/${urlService}/${payload.id}`, payload)
            .then(({ data }) => {
                commit('actualizarContratosSuccess', payload);
                resolve(data);
            })
            .catch((error) => {
                console.log(error.response);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function eliminarContratosAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'contratos';
    return new Promise((resolve, reject) => {
        axios
            .delete(`${URL_API}/${urlService}/${payload.id}`)
            .then(({ data }) => {
                commit('actualizarContratosSuccess', payload);
                resolve(data);
            })
            .catch((error) => {
                console.log(error.response);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function unsetContratosAction({ commit }) {
    commit('unsetContratos');
}
