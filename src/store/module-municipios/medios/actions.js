import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaMedioAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/medio-comunicacion`)
      .then(({ data }) => {        
        commit('setListaMedioSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las medios: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaMedioAction ({ commit }) {
  commit('unsetListaMedio')
}

// Acciones para un objeto Calidad De Vida

export function registrarMedioAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'medios-comunicacion'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setMedioSuccess', info);
      commit('agregarMedioState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarMedioAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'medios-comunicacion'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarMedioSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetMedioAction({commit}){
  commit('unsetMedio')
}
