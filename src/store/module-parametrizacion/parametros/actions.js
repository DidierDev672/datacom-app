import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaParametroAction ({ commit }) {
  console.log("prueba")
  commit('inicializarAccion')
  const urlService = 'parametro'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaParametroSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las parametros: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaParametroPorCategoriaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'parametro'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/categoria/${payload}`)
      .then(({ data }) => {
        commit('setListaParametroSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las parametros: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaCategoriasAction ({ commit }) {
  commit('unsetListaCategorias')
}

// Acciones para un objeto Empresa

// export function buscarCategoriaAction({commit}, payload){

//   commit('inicializarAccion');

//   const url_service = 'company';
//   return new Promise((resolve, reject) => {
//     axios.get(`${URL_API}/${url_service}/${payload.companies_id}/autoevaluacion/${payload.autoevaluacion_id}`).then( ({data}) => {
//       commit('setAutoevaluacionSuccess', data);
//       resolve(data);
//     }).catch( error => {
//       commit('setActionFail', error.response);
//       reject(error.response);
//     });
//   });
// }

export function registrarParametroAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'parametro'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        commit('agregarParametroState', data)
        commit('setParametroSuccess', data)
        resolve(data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function actualizarParametroAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'parametro'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('setParametroSuccess', data)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

// export function actualizarCategoriaAction({commit}, payload){

// commit('inicializarAccion');

// const url_service = 'autoevaluacion';

//   return new Promise((resolve, reject) => {
//     axios.put(`${URL_API}/${url_service}/${payload.id}`, payload)
//       .then( ({data}) => {
//         commit('updateAutoevaluacionSuccess', payload);
//         resolve(data);
//       })
//       .catch( error => {
//         console.log(error.response);
//         commit('setActionFail', error.response);
//         reject(error.response);
//       });
//   });

// }

// export function eliminarCategoriaAction({commit}, payload){

//   commit('inicializarAccion');

//   const url_service = 'company';

//   return new Promise((resolve, reject) => {
//     axios.delete(`${URL_API}/${url_service}/${payload.companies_id}/autoevaluacion/${payload.autoevaluacion_id}`)
//     .then( (response) => {
//       commit('eliminarAutoevaluacion', payload)
//       resolve(response);
//     })
//     .catch(error => {
//       reject(error);
//     });
//   });

// }

// export function unsetCategoriaAction({commit}){
//   commit('unsetAutoevaluacion')
// }
