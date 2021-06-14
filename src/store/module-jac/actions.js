import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaJacAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaJacSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaJacAction ({ commit }) {
  commit('unsetListaJac')
}

// Acciones para un objeto Calidad De Vida

export function registrarJacAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setJacSuccess', info);
      commit('agregarJacState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarJacAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarJacSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetJacAction({commit}){
  commit('unsetJac')
}
