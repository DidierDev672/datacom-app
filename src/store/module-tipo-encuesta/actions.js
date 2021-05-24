import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaTipoEncuestaAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'tipo-encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaTipoEncuestaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaTipoEncuestaAction ({ commit }) {
  commit('unsetListaTipoEncuesta')
}

// Acciones para un objeto Calidad De Vida

export function registrarTipoEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'tipo-encuesta'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setTipoEncuestaSuccess', info);
      commit('agregarTipoEncuestaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarTipoEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'tipo-encuesta'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarTipoEncuestaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarTipoEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'tipo-encuesta'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarTipoEncuestaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetTipoEncuestaAction({commit}){
  commit('unsetTipoEncuesta')
}
