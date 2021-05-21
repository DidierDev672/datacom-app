import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaCoberturaAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/cobertura-servicios`)
      .then(({ data }) => {        
        commit('setListaCoberturaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar la cobertura en servicios: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaCoberturaAction ({ commit }) {
  commit('unsetListaCobertura')
}

// Acciones para un objeto Calidad De Vida

export function registrarCoberturaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'servicio'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setCoberturaSuccess', info);
      commit('agregarCoberturaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarCoberturaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'servicio'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarCoberturaSuccess', payload)
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

export function unsetCoberturaAction({commit}){
  commit('unsetCobertura')
}
