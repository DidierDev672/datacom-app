import axios from 'axios'
import { URL_API } from 'src/utils/config'

// Acciones para la lista
// export function cargarListaDetalleAutoevaluacionAction ({ commit }, municipioID) {
//   commit('inicializarAccion')
//   const urlService = 'ficha-municipio'
//   return new Promise((resolve, reject) => {
//     axios.get(`${URL_API}/${urlService}/${municipioID}/detalle-autoevaluacion`)
//       .then(({ data }) => {
//         commit('setListaDetalleAutoevaluacionSuccess', data)
//         resolve(data)
//       }).catch(error => {
//         console.log('Ocurrió un error al consultar las secretarias: ', error.response)
//         commit('setActionFail', error.response)
//         reject(error.response)
//       })
//   })
// }

// export function unsetListaDetalleAutoevaluacionAction ({ commit }) {
//   commit('unsetListaDetalleAutoevaluacion')
// }

// Acciones para un objeto Calidad De Vida

export function buscarDatosViviendaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${payload}/info-vivienda`).then( ({data}) => {
      commit('setDatosViviendaSuccess', data);
      resolve(data);
    }).catch( error => {
      console.log('Error al buscar datos de la vivienda: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarDatosViviendaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'informacion-vivienda'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
        ...payload,
        id: data
      }
        commit('setDatosViviendaSuccess', info)
        commit('agregarDatosViviendaState', info)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function actualizarDatosViviendaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'informacion-vivienda'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarDatosViviendaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetDatosViviendaAction({commit}){
  commit('unsetDatosVivienda')
}
