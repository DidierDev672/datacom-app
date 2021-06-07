import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaProgramasEducativosAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/programas-educativos`)
      .then(({ data }) => {        
        commit('setListaProgramasEducativosSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las secretarias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaPersonalProgramaEducativoAction ({ commit }, programaEducativoID) {
  // commit('inicializarAccion')
  const urlService = 'instituciones-educativas'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${programaEducativoID}/personal`)
      .then(({ data }) => {
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los municipios de un departamento: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaProgramasEducativosAction ({ commit }) {
  commit('unsetListaProgramasEducativos')
}

// Acciones para un objeto Calidad De Vida

export function registrarProgramasEducativosAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'instituciones-educativas'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setProgramasEducativosSuccess', info);
      commit('agregarProgramasEducativosState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarProgramasEducativosAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'instituciones-educativas'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarProgramasEducativosSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetProgramasEducativosAction({commit}){
  commit('unsetProgramasEducativos')
}
