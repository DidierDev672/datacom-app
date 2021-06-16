import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaActividadEconomicaAction ({ commit }, encuestaID) {
  commit('inicializarAccion')
  const urlService = 'actividad-economica/encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}/`)
      .then(({ data }) => {
        commit('setListaActividadEconomicaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar las actividades economicas: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaComiteEmergenciaAction ({ commit }) {
  commit('unsetListaActivdadEconomica')
}

// Acciones para un objeto Calidad De Vida

export function registrarActividadEconomicaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'actividad-economica'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setActividadEconomicaSuccess', info);
      commit('agregarActividadEconomicaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarActividadEconomicaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'actividad-economica'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarActividadEconomicaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetActividadEconomicaAction({commit}){
  commit('unsetActividadEconomica')
}
