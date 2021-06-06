import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function buscarTerritorioAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/territorio`)
      .then(({ data }) => {        
        commit('setTerritorioSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las viviendas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaTerritorioAction ({ commit }) {
  commit('unsetListaTerritorio')
}

// Acciones para un objeto Calidad De Vida


export function registrarTerritorioAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'territorio'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setTerritorioSuccess', info);
      commit('agregarTerritorioState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarTerritorioAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'territorio'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarTerritorioSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetTerritorioAction({commit}){
  commit('unsetTerritorio')
}
