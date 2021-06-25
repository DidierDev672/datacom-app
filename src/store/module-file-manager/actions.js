import axios from 'axios'
import { URL_API } from '../../utils/config'

// Acciones para la lista
export function cargarListaFileManagerAction ({ commit }) {
  commit('inicializarAccion')
  const urlService = 'documento-adjunto'
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit('setListaFileManagerSuccess', data)
        resolve(data)
      }).catch(error => {
        console.log('Ocurrió un error al consultar los archivos: ', error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetListaFileManagerAction ({ commit }) {
  commit('unsetListaFileManager')
}

// Acciones para un objeto Calidad De Vida

export function buscarFileAction({commit}, file){

  commit('inicializarAccion');

  const urlService = 'documento-adjunto';
  return new Promise((resolve, reject) => {
    axios.get(`${URL_API}/${urlService}/${file.id}`, { responseType: 'blob' }).then( ({data}) => {
      console.log('DATA: ', data);
      setTimeout(() => {
          const url = window.URL.createObjectURL(data);
          console.log('Url: ', url)
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.href = url;
          a.download = file.nombreOriginal;
          a.click();
          return url;

      }, 500)
    }).catch( error => {
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function registrarFileManagerAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'documento-adjunto'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {
      let info = {
        ...payload,
        id: data
      }
      commit('setFileManagerSuccess', info);
      commit('agregarFileManagerState', info);
      resolve(data);
    }).catch( error => {
      console.log('Error al guardar: ', error);
      commit('setActionFail', error.response);
      reject(error.response);
    });
  });
}

export function actualizarFileManagerAction ({ commit }, payload) {
  commit('inicializarAccion')
  const urlService = 'documento-adjunto'
  return new Promise((resolve, reject) => {
    axios.put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit('actualizarFileManagerSuccess', payload)
        resolve(data)
      })
      .catch(error => {
        console.log(error.response)
        commit('setActionFail', error.response)
        reject(error.response)
      })
  })
}

export function unsetFileManagerAction({commit}){
  commit('unsetFileManager')
}
