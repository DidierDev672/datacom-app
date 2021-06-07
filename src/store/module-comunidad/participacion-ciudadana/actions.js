import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaParticipacionAction ({ commit }, encuestaID) {
  commit('inicializarAccion')
  const urlService = 'participacion-ciudadana'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}/`)
      .then(({ data }) => {
        commit('setListaParticipacionCiudadanaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar las participacion ciudadana: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaParticipacionCiudadanaAction ({ commit }) {
  commit('unsetListaParticipacionCiudadana')
}

// Acciones para un objeto Calidad De Vida

export function registrarParticipacionCiudadanaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'participacion-ciudadana'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setParticipacionCiudadanaSuccess', info);
      commit('agregarParticipacionCiudadanaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarParticipacionCiudadanaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'participacion-ciudadana'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarParticipacionCiudadanaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetParticipacionCiudadanaAction({commit}){
  commit('unsetParticipacion')
}
