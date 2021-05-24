import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaOrganizacionAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/organizaciones`)
      .then(({ data }) => {        
        commit('setListaOrganizacionSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaOrganizacionAction ({ commit }) {
  commit('unsetListaOrganizacion')
}

// Acciones para un objeto Calidad De Vida

export function registrarOrganizacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'organizacion'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setOrganizacionSuccess', info);
      commit('agregarOrganizacionState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarOrganizacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'organizacion'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarOrganizacionSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetOrganizacionAction({commit}){
  commit('unsetOrganizacion')
}
