import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaDepartamentoAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'departamento'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaDepartamentoSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaMunicipiosDelDepartamentoAction ({ commit }, departamentoID) {
  commit('inicializarAccion')
  const urlService = 'departamento'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${departamentoID}/municipios`)
      .then(({ data }) => {
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los municipios de un departamento: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaDepartamentoAction ({ commit }) {
  commit('unsetListaDepartamento')
}
