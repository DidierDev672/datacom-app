import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaComunidadAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'comunidad'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaComunidadSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las comunidades: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaComunidadAction ({ commit }) {
  commit('unsetListaComunidad')
}

// Acciones para un objeto Municipio

export function buscarComunidadAction({commit}, comunidadID){

  commit('inicializarAccion');

  const urlService = 'comunidad';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${comunidadID}`).then( ({data}) => {
      commit('setComunidadSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

// Acciones para un objeto Comunidad