import axios from 'axios'
import { URL_API } from '../../../../utils/config'

// Acciones para la lista
export function cargarListaPersonalComiteEmergenciaAction ({ commit }, encuestaID) {
  commit('inicializarAccion')
  const urlService = 'personal-comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`)
      .then(({ data }) => {
        commit('setListaPersonalComiteEmergenciaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar las secretarias: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}
export function cargarListaPersonalComiteEmergenciaPorComiteAction ({ commit }, encuestaID) {
  commit('inicializarAccion')
  const urlService = 'personal-comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}/comite`)
      .then(({ data }) => {
        commit('setListaPersonalComiteEmergenciaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar las secretarias: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}
export function unsetListaPersonalComiteEmergenciaAction ({ commit }) {
  commit('unsetPersonalListaComiteEmergencia')
}

// Acciones para un objeto Calidad De Vida

export function registrarPersonalComiteEmergenciaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'personal-comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setPersonalComiteEmergenciaSuccess', info);
      commit('agregarPersonalComiteEmergenciaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarPersonalComiteEmergenciaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'personal-comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarPersonalComiteEmergenciaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}
export function eliminarPersonalComiteEmergenciaActions ({}, payload) {
  const urlService = 'personal-comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload}`).then( ({data}) => {
      resolve(data);
    }).catch( error => {
      reject(error.response);
    });
  });
}
export function unsetPersonalComiteEmergenciaAction({commit}){
  commit('unsetPersonalComiteEmergencia')
}
