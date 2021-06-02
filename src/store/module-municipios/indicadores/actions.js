import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function buscarIndicadorAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/indicadores`)
      .then(({ data }) => {        
        commit('setIndicadorSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las viviendas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaIndicadorAction ({ commit }) {
  commit('unsetListaIndicador')
}

// Acciones para un objeto Calidad De Vida

export function registrarIndicadorAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'indicador'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setIndicadorSuccess', info);
      commit('agregarIndicadorState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarIndicadorAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'indicador'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarIndicadorSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetIndicadorAction({commit}){
  commit('unsetIndicador')
}
