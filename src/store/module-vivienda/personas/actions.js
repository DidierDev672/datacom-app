import axios from "axios";
import { URL_API } from "src/utils/config";

// Acciones para la lista
export function cargarListaPersonaAction({ commit }, viviendaID) {
  commit("inicializarAccion");
  const urlService = "ficha-municipio";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${viviendaID}/personas`)
      .then(({ data }) => {
        commit("setListaPersonaSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar las personas: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaPersonaAction({ commit }) {
  commit("unsetListaPersona");
}

// Acciones para un objeto Persona

export function buscarPersonaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "integrante-hogar";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${payload}`)
      .then(({ data }) => {
        commit("setPersonaSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al buscar datos de la persona: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function registrarPersonaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "integrante-hogar";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setPersonaSuccess", info);
        commit("agregarPersonaState", info);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function actualizarPersonaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "integrante-hogar";
  return new Promise((resolve, reject) => {
    axios
      .put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit("actualizarPersonaSuccess", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function eliminarPersonaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "integrante-hogar";
  return new Promise((resolve, reject) => {
    axios
      .delete(`${URL_API}/${urlService}/${payload}`)
      .then(({ data }) => {
        commit("eliminarPersona", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetPersonaAction({ commit }) {
  commit("unsetPersona");
}
