import axios from "axios";
import { URL_API } from "../../utils/config";

// Acciones para la lista
export function cargarListaUsuarioAction({ commit }, municipioID) {
  commit("inicializarAccion");
  const urlService = "usuario";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaUsuarioSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar los usuarios: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaUsuarioAction({ commit }) {
  commit("unsetListaUsuario");
}

// Acciones para un objeto Calidad De Vida

export function buscarUsuarioAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "usuario";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${payload}`)
      .then(({ data }) => {
        commit("setUsuarioSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al consultar el usuario: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function registrarUsuarioAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "usuario";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setUsuarioSuccess", info);
        commit("agregarUsuarioState", info);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al guardar: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function actualizarUsuarioAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "usuario";
  return new Promise((resolve, reject) => {
    axios
      .put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit("actualizarUsuarioSuccess", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetUsuarioAction({ commit }) {
  commit("unsetUsuario");
}
