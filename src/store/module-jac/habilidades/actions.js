import axios from 'axios';
import { URL_API } from '../../../utils/config';

// Acciones para la lista
export function cargarListaHabilidadesAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'habilidades-jac';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/jac/${payload}`)
            .then(({ data }) => {
                commit('setListaHabilidadesSuccess', data);
                resolve(data);
            })
            .catch((error) => {
                console.log(
                    'Ocurrió un error al consultar los tipos de Habilidades: ',
                    error.response
                );
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function unsetListaHabilidadesAction({ commit }) {
    commit('unsetListaHabilidades');
}

// Acciones para un objeto Calidad De Vida

export function buscarHabilidadesAction({ commit }, encuestaID) {
    commit('inicializarAccion');

    const urlService = 'habilidades-jac';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${encuestaID}`)
            .then(({ data }) => {
                commit('setHabilidadesSuccess', data);
                resolve(data);
            })
            .catch((error) => {
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function registrarHabilidadesAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'habilidades-jac';
    return new Promise((resolve, reject) => {
        axios
            .post(`${URL_API}/${urlService}/`, payload)
            .then(({ data }) => {
                let info = {
                    ...payload,
                    id: data,
                };
                commit('setHabilidadesSuccess', info);
                commit('agregarHabilidadesState', info);
                resolve(data);
            })
            .catch((error) => {
                console.log('Error al guardar: ', error);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function actualizarHabilidadesAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'habilidades-jac';
    return new Promise((resolve, reject) => {
        axios
            .put(`${URL_API}/${urlService}/${payload.id}`, payload)
            .then(({ data }) => {
                commit('actualizarHabilidadesSuccess', payload);
                resolve(data);
            })
            .catch((error) => {
                console.log(error.response);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function eliminarHabilidadesAction({ commit }, payload) {
    commit('inicializarAccion');
    const urlService = 'habilidades-jac';
    return new Promise((resolve, reject) => {
        axios
            .delete(`${URL_API}/${urlService}/${payload.id}`)
            .then(({ data }) => {
                commit('actualizarHabilidadesSuccess', payload);
                resolve(data);
            })
            .catch((error) => {
                console.log(error.response);
                commit('setActionFail', error.response);
                reject(error.response);
            });
    });
}

export function unsetHabilidadesAction({ commit }) {
    commit('unsetHabilidades');
}
