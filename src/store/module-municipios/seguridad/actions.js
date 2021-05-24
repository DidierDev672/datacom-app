import axios from 'axios'
import { URL_API } from '../../../utils/config'

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
