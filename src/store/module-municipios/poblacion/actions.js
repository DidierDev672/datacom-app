import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function buscarPoblacionAction ({ commit }, municipioID) {
  commit('inicializarAccion')
  const urlService = 'ficha-municipio'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${municipioID}/poblacion`)
      .then(({ data }) => {        
        commit('setPoblacionSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar la lista de poblacion: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaPoblacionAction ({ commit }) {
  commit('unsetListaPoblacion')
}



// Acciones para un objeto Poblacion



export function guardarPoblacion({commit}, payload){
  commit('inicializarAccion');

  const urlService = 'poblacion';
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {      
      commit('setPoblacionSuccess', {
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

export function actualizarPoblacionAction({commit}, payload){

  commit('inicializarAccion');

  const urlService = 'poblacion';
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload).then( ({data}) => {      
      resolve(data);         
    }).catch( error => {
      console.log('Error al actualizar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function eliminarPoblacionAction({commit}, poblacionID){

  commit('inicializarAccion');  

  const urlService = 'poblacion';
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${poblacionID}`).then( ({data}) => {      
      resolve(data);         
    }).catch( error => {
      console.log('Error al actualizar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

