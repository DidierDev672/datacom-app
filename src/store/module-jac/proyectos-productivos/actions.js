import axios from 'axios'
import { URL_API } from '../../../utils/config'

// Acciones para la lista
export function cargarListaProyectosProductivosAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'proyectos-productivos'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaParticipacionSuccess', data)
        resolve(data)
      }).catch(error => {
      console.log('Ocurrió un error al consultar los tipos de Participacion jac: ', error.response)
      commit('setActionFail', error.response)
      reject(error.response)
    })
  })
}

export function unsetListaProyectosProductivosAction ({ commit }) {
  commit('unsetListaParticipacion')
}

// Acciones para un objeto Calidad De Vida

export function buscarProyectosProductivosAction({commit}, encuestaID){

  commit('inicializarAccion');

  const urlService = 'proyectos-productivos';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${encuestaID}`).then( ({data}) => {
      commit('setProyectosProductivosSuccess', data);
      resolve(data);
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarProyectosProductivosAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'proyectos-productivos'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setProyectosProductivosSuccess', info);
      commit('agregarProyectosProductivosState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarProyectosProductivosAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'proyectos-productivos'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarProyectosProductivosSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function eliminarProyectosProductivosAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'proyectos-productivos'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload.id}`)
      .then(({ data }) => {
        commit('actualizarProyectosProductivosSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetProyectosProductivosAction({commit}){
  commit('unsetProyectosProductivos')
}
