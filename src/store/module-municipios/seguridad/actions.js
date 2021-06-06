import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function buscarSeguridadAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/seguridad`)
      .then(({ data }) => {        
        commit('setSeguridadSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar la cobertura en servicios: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

// Acciones para un objeto Calidad De Vida

export function registrarSeguridadAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'seguridad'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setSeguridadSuccess', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarSeguridadAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'seguridad'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarSeguridadSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetSeguridadAction({commit}){
  commit('unsetSeguridad')
}
