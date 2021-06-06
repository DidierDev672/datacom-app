import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function buscarCalidadDeVidaAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/calidad-de-vida`)
      .then(({ data }) => {        
        commit('setCalidadDeVidaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las categorias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaCalidadDeVidaAction ({ commit }) {
  commit('unsetListaCalidadDeVida')
}

// Acciones para un objeto Calidad De Vida

export function registrarCalidadDeVidaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'calidad-de-vida'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setCalidadDeVidaSuccess', info);
      commit('agregarCalidadDeVidaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarCalidadDeVidaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'calidad-de-vida'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarCalidadDeVidaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarCalidadDeVidaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'calidad-de-vida'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarCalidadDeVidaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetCalidadDeVidaAction({commit}){
  commit('unsetCalidadDeVida')
}
