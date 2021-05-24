import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaInfraestructuraAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/infraestructura`)
      .then(({ data }) => {        
        commit('setListaInfraestructuraSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaInfraestructuraAction ({ commit }) {
  commit('unsetListaInfraestructura')
}

// Acciones para un objeto Calidad De Vida

export function registrarInfraestructuraAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'infraestructura-publica'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setInfraestructuraSuccess', info);
      commit('agregarInfraestructuraState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarInfraestructuraAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'infraestructura-publica'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarInfraestructuraSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetInfraestructuraAction({commit}){
  commit('unsetInfraestructura')
}
