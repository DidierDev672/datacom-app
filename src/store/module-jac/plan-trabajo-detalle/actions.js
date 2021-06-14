import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista

// Acciones para un objeto Plan de trabajo

export function buscarPlanTrabajoDetalleAction ({ commit }, planTrabajoDetalleID) {
  commit('inicializarAccion')
  const urlService = 'ico-plan-trabajo-detalle'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${planTrabajoDetalleID}`).then( ({data}) => {
      commit('setPlanTrabajoDetalleSuccess', data);
      resolve(data);
    }).catch( error => {
      console.log('Error al buscar plan de trabajo: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarPlanTrabajoDetalleAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'ico-plan-trabajo-detalle'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarPlanTrabajoDetalleSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetPlanTrabajoDetalleAction({commit}){
  commit('unsetPlanTrabajoDetalle')
}
