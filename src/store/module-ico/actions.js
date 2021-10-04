import axios from "axios";
import { URL_API } from "src/utils/config";

// Acciones para la lista
export function cargarListaIcoAction({ commit }) {
  commit("inicializarAccion");
  const urlService = "ico-evaluacion";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaIcoSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Ocurrió un error al consultar los icos: ", error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

// Acciones para un objeto Calidad De Vida

export function registrarIcoAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "ico-evaluacion";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setIcoSuccess", info);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al guardar: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function buscarIcoAction({ commit }, icoID) {
  commit("inicializarAccion");
  const urlService = "ico-evaluacion";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${icoID}`)
      .then(({ data }) => {
        commit("setIcoSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al buscar: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function buscarEvaluacionesPorJacAction({}, jacID) {
  // commit("inicializarAccion");
  const urlService = "ico-evaluacion";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/jac/${jacID}`)
      .then(({ data }) => {
        console.log("Evaluaciones: ", data);
        // commit("setIcoSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al buscar las evaluaciones: ", error);
        // commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}
