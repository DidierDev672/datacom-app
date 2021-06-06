import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para un objeto Calidad De Vida

export function buscarInformacionGeneralAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/info-general`).then( ({data}) => {
      // if(Object.keys(data).length > 0){
          commit('setInformacionGeneralSuccess', data);
        //}          
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
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


export function unsetInformacionGeneralAction({commit}){
  commit('unsetInformacionGeneral')
}
