import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaCategoriasAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'categoria'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {        
        commit('setListaCategoriasSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar las categorias: ', error.response)
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

export function registrarCategoriaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'categoria'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        // Dialog.create({
        //   title: 'Alert',
        //   message: 'Ha guardado la categoria'
        //  })
        commit('agregarCategoriaState', data)
        commit('setCategoriaSuccess', data)
        resolve(data)
      })
      .catch(error => {
        // Dialog.create({
        //   title: 'Alert',
        //   message: 'Ha ocurrido un error al grabar la categoria' + error
        //  })
        // console.log(error.response)
        // commit('setActionFail', error.response)
        reject(error)
      })
  })
}

export function actualizarCategoriaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'categoria'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        // commit('agregarCategoriaState', data)
        commit('setCategoriaSuccess', data)
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
