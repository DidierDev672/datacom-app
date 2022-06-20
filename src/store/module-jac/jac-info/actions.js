import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaJacInfoAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/?page=${payload.page}&size=${payload.rowsPerPage}&filter=${payload.filter}`)
      .then(response => {
        commit('setListaJacInfoSuccess', response.data.content)
        resolve(response)
      }).catch(error => {
      console.log('Ocurrió un error al consultar los tipos de Jac: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaJacInfoAction ({ commit }) {
  commit('unsetListaJacInfo')
}

// Acciones para un objeto Calidad De Vida

export function buscarJacInfoAction({commit}, encuestaID){

  commit('inicializarAccion');

  const urlService = 'jac';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`).then( ({data}) => {
      commit('setJacInfoSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarJacInfoAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setJacInfoSuccess', info);
      commit('agregarJacInfoState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarJacInfoAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarJacInfoSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarJacInfoAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'jac'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarJacInfoSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetJacInfoAction({commit}){
  commit('unsetJacInfo')
}
