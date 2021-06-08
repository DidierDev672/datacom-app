import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaInfrasaludAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/infrasalud`)
      .then(({ data }) => {        
        commit('setListaInfrasaludSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las Infrasalud: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaPersonalInfrasaludAction ({ commit }, infrasaludID) {
  // commit('inicializarAccion')
  const urlService = 'infrasalud'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${infrasaludID}/personal`)
      .then(({ data }) => {
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar el personal de salud: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaServicioInfrasaludAction ({ commit }, infrasaludID) {
  // commit('inicializarAccion')
  const urlService = 'infrasalud'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${infrasaludID}/servicios`)
      .then(({ data }) => {
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los servicios de salud: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaInfrasaludAction ({ commit }) {
  commit('unsetListaInfrasalud')
}

// Acciones para un objeto Calidad De Vida

export function registrarInfrasaludAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'infrasalud'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setInfrasaludSuccess', info);
      commit('agregarInfrasaludState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarInfrasaludAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'infrasalud'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarInfrasaludSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetInfrasaludAction({commit}){
  commit('unsetInfrasalud')
}
