import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaPoliticasPublicasAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/politicas`)
      .then(({ data }) => {        
        commit('setListaPoliticasPublicasSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las politicas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaPoliticasPublicasAction ({ commit }) {
  commit('unsetListaPoliticasPublicas')
}

// Acciones para un objeto Calidad De Vida

export function registrarPoliticasPublicasAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'politicas-publicas'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setPoliticasPublicasSuccess', info);
      commit('agregarPoliticasPublicasState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarPoliticasPublicasAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'politicas-publicas'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarPoliticasPublicasSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetPoliticasPublicasAction({commit}){
  commit('unsetPoliticasPublicas')
}
