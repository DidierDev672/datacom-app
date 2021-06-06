import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaPoblacionInfantilAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/atencion-poblacion-infantil`)
      .then(({ data }) => {        
        commit('setListaPoblacionInfantilSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las Infrasalud: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaPoblacionInfantilAction ({ commit }) {
  commit('unsetListaPoblacionInfantil')
}

// Acciones para un objeto Calidad De Vida

export function registrarPoblacionInfantilAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'atencion-poblacion-infantil'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }      
      commit('setPoblacionInfantilSuccess', info);
      commit('agregarPoblacionInfantilState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarPoblacionInfantilAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'atencion-poblacion-infantil'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarPoblacionInfantilSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetPoblacionInfantilAction({commit}){
  commit('unsetPoblacionInfantil')
}
