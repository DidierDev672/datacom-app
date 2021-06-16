import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaJuntaDirectivaAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'junta-directiva'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaJuntaDirectivaSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar los tipos de Junta Directiva: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaJuntaDirectivaAction ({ commit }) {
  commit('unsetListaJuntaDirectiva')
}

// Acciones para un objeto Calidad De Vida

export function buscarJuntaDirectivaAction({commit}, encuestaID){

  commit('inicializarAccion');

  const urlService = 'junta-directiva';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`).then( ({data}) => {
      commit('setJuntaDirectivaSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarJuntaDirectivaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'junta-directiva'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setJuntaDirectivaSuccess', info);
      commit('agregarJuntaDirectivaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarJuntaDirectivaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'junta-directiva'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarJuntaDirectivaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarJuntaDirectivaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'junta-directiva'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarJuntaDirectivaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetJuntaDirectivaAction({commit}){
  commit('unsetJuntaDirectiva')
}
