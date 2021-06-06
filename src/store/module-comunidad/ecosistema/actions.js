import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaEcosistemaAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/ecosistemas`)
      .then(({ data }) => {        
        commit('setListaEcosistemaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaEcosistemaAction ({ commit }) {
  commit('unsetListaEcosistema')
}

// Acciones para un objeto Calidad De Vida

export function registrarEcosistemaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'ecosistemas'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setEcosistemaSuccess', info);
      commit('agregarEcosistemaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarEcosistemaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'ecosistemas'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarEcosistemaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetEcosistemaAction({commit}){
  commit('unsetEcosistema')
}
