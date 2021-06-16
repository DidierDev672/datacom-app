import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaParticipacionAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'participacion-jac'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaParticipacionSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar los tipos de Participacion jac: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaParticipacionAction ({ commit }) {
  commit('unsetListaParticipacion')
}

// Acciones para un objeto Calidad De Vida

export function buscarParticipacionAction({commit}, encuestaID){

  commit('inicializarAccion');

  const urlService = 'participacion-jac';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`).then( ({data}) => {
      commit('setParticipacionSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarParticipacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'participacion-jac'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setParticipacionSuccess', info);
      commit('agregarParticipacionState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarParticipacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'participacion-jac'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarParticipacionSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarParticipacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'participacion-jac'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarParticipacionSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetParticipacionAction({commit}){
  commit('unsetParticipacion')
}
