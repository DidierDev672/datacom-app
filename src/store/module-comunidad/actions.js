import axios from "axios";
import { URL_API } from "../../../src/utils/config";

// Acciones para la lista
export function cargarListaComunidadAction({ commit }, payload) {
  //?page=${p}&size=${s}`
  //`${URL_API}/${urlService}/paginados?page=${payload.page}&size=${payload.rowsPerPage}&sort=${payload.sort}`
  commit("inicializarAccion");
  const urlService = "comunidad";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/paginados?page=${payload.page}&size=${payload.rowsPerPage}&filter=${payload.filter}`
      )
      .then(response => {
        commit("setListaComunidadSuccess", response.data.content);
        resolve(response);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar las comunidades: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaComunidadAction({ commit }) {
  commit("unsetListaComunidad");
}

// Acciones para un objeto Municipio

export function buscarComunidadAction({ commit }, comunidadID) {
  commit("inicializarAccion");

  const urlService = "comunidad";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${comunidadID}`)
      .then(({ data }) => {
        commit("setComunidadSuccess", data);
        resolve(data);
      })
      .catch(error => {
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function registrarComunidadAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "comunidad";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setComunidadSuccess", info);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al guardar: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

// Acciones para un objeto Comunidad
