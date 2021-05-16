import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaMunicipiosAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaMunicipiosSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las categorias: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaMunicipiosAction ({ commit }) {
  commit('unsetListaMunicipios')
}

// Acciones para un objeto Municipio

export function buscarMunicipioAction({commit}, municipioID){

  commit('inicializarAccion');

  const urlService = 'municipio';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}`).then( ({data}) => {
      commit('setMunicipioSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

// Acciones para un objeto InformacionGeneral

export function actualizarInformacionGeneralAction({commit}, payload){

  commit('inicializarAccion');

  const urlService = 'informacion_general';
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload).then( ({data}) => {     
      commit('setInformacionGeneralSuccess', {
        ...payload,
        id: data
      });
      resolve(data);         
    }).catch( error => {
      console.log('Error al actualizar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function guardarInformacionGeneralAction({commit}, payload){

  commit('inicializarAccion');

  const urlService = 'informacion_general';
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {      
      commit('setInformacionGeneralSuccess', {
        ...payload,
        id: data
      });
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}