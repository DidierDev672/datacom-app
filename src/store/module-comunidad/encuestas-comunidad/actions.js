import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaEncuestasComunidadAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'comunidad'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/encuestas?page=${payload.page}&size=${payload.rowsPerPage}&filter=${payload.filter}`)
      .then(response => {
        console.log('Data: ', response)
        commit('setListaEncuestasComunidadSuccess', response.data.content)
        resolve(response)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las comunidades: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaEncuestasComunidadAction ({ commit }) {
  commit('unsetListaEncuestasComunidad')
}


