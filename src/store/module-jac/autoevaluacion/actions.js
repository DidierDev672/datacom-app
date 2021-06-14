import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaDetalleAutoevaluacionAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/detalle-autoevaluacion`)
      .then(({ data }) => {        
        commit('setListaDetalleAutoevaluacionSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaDetalleAutoevaluacionAction ({ commit }) {
  commit('unsetListaDetalleAutoevaluacion')
}

// Acciones para un objeto Calidad De Vida

export function actualizarDetalleAutoevaluacionAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'ico-detalle-autoevaluacion'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarDetalleAutoevaluacionSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetDetalleAutoevaluacionAction({commit}){
  commit('unsetDetalleAutoevaluacion')
}
