import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaComiteEmergenciaAction ({ commit }, encuestaID) {
  commit('inicializarAccion')
  const urlService = 'comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/encuesta/${encuestaID}`)
      .then(({ data }) => {
        commit('setListaComiteEmergenciaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar las secretarias: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}


export function unsetListaComiteEmergenciaAction ({ commit }) {
  commit('unsetListaComiteEmergencia')
}

// Acciones para un objeto Calidad De Vida

export function registrarComiteEmergenciaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setComiteEmergenciaSuccess', info);
      commit('agregarComiteEmergenciaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarComiteEmergenciaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'comite-de-emergencia'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarComiteEmergenciaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetComiteEmergenciaAction({commit}){
  commit('unsetComiteEmergencia')
}
