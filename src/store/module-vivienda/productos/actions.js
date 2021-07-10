import axios from "axios";
import { URL_API } from "src/utils/config";

// Acciones para la lista
export function cargarListaProductoViviendaAction({ commit }, viviendaID) {
  commit("inicializarAccion");
  const urlService = "ficha-municipio";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${viviendaID}/productos-vivienda`)
      .then(({ data }) => {
        commit("setListaProductoViviendaSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar los productos: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaProductoViviendaAction({ commit }) {
  commit("unsetListaProductoVivienda");
}

// Acciones para un objeto Persona

export function buscarProductoViviendaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "productos-vivienda";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${payload}`)
      .then(({ data }) => {
        commit("setProductoViviendaSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al buscar datos de la persona: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function registrarProductoViviendaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "productos-vivienda";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setProductoViviendaSuccess", info);
        commit("agregarProductoViviendaState", info);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function actualizarProductoViviendaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "productos-vivienda";
  return new Promise((resolve, reject) => {
    axios
      .put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit("actualizarProductoViviendaSuccess", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function eliminarProductoViviendaAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "productos-vivienda";
  return new Promise((resolve, reject) => {
    axios
      .delete(`${URL_API}/${urlService}/${payload}`)
      .then(({ data }) => {
        commit("eliminarProductoVivienda", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetProductoViviendaAction({ commit }) {
  commit("unsetProductoVivienda");
}
