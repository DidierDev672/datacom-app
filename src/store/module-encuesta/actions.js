import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaEncuestaAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaEncuestaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaEncuestaEnProcesoAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/en-proceso`)
      .then(({ data }) => {
        commit('setListaEncuestaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaEncuestaCerradasAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/cerradas`)
      .then(({ data }) => {
        commit('setListaEncuestaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function cargarListaEncuestaPorTipoAction ({ commit }, tipo) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${tipo}/tipo-encuesta`)
      .then(({ data }) => {
        commit('setListaEncuestaSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los tipos de encuestas: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaEncuestaAction ({ commit }) {
  commit('unsetListaEncuesta')
}

// Acciones para un objeto Calidad De Vida

export function buscarEncuestaAction({commit}, encuestaID){

  commit('inicializarAccion');

  const urlService = 'encuesta';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`).then( ({data}) => {
      commit('setEncuestaSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setEncuestaSuccess', info);
      commit('agregarEncuestaState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarEncuestaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarEncuestaAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'encuesta'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarEncuestaSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetEncuestaAction({commit}){
  commit('unsetEncuesta')
}
