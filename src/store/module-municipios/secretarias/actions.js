import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaSecretariaAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/secretarias`)
      .then(({ data }) => {        
        commit('setListaSecretariaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaSecretariaAction ({ commit }) {
  commit('unsetListaSecretaria')
}

// Acciones para un objeto Calidad De Vida

export function registrarSecretariaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'administracion-publica'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setSecretariaSuccess', info);
      commit('agregarSecretariaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarSecretariaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'administracion-publica'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarSecretariaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

// export function eliminarViviendaAction ({ commit }, payload) {
//   commit('inicializarAccion')
//   const urlService = 'vivienda'
//   return new Promise((resolve, reject) => {
//     axios.delete(`${URL_API}/${urlService}/${payload.id}`)
//       .then(({ data }) => {
//         commit('actualizarCalidadDeVidaSuccess', payload)
//         resolve(data)
//       })
//       .catch(error => {
//         console.log(error.response)
//         commit('setActionFail', error.response)
//         reject(error.response)
//       })
//   })
// }

export function unsetSecretariaAction({commit}){
  commit('unsetSecretaria')
}
