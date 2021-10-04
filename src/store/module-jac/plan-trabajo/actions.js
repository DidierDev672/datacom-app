import axios from "axios";
import { URL_API } from "../../../utils/config";

// Acciones para la lista
export function cargarListaPlanTrabajoAction({ commit }) {
  commit("inicializarAccion");
  const urlService = "ico-plan-trabajo";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaPlanTrabajoSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar plan de trabajo: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaPlanTrabajoAction({ commit }) {
  commit("unsetListaPlanTrabajo");
}

// Acciones para un objeto Plan de trabajo

export function buscarPlanTrabajoAction({ commit }, planTrabajoID) {
  commit("inicializarAccion");
  const urlService = "ico-plan-trabajo";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${planTrabajoID}`)
      .then(({ data }) => {
        commit("setPlanTrabajoSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al buscar plan de trabajo: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function buscarPlanTrabajoPorEncuestaAction({ commit }, encuestaID) {
  const urlService = "encuesta";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/${encuestaID}/plan-trabajo`)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function registrarPlanTrabajoAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "ico-plan-trabajo";
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL_API}/${urlService}/`, payload)
      .then(({ data }) => {
        let info = {
          ...payload,
          id: data
        };
        commit("setPlanTrabajoSuccess", info);
        commit("agregarPlanTrabajoState", info);
        resolve(data);
      })
      .catch(error => {
        console.log("Error al guardar: ", error);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function actualizarPlanTrabajoAction({ commit }, payload) {
  commit("inicializarAccion");
  const urlService = "ico-plan-trabajo";
  return new Promise((resolve, reject) => {
    axios
      .put(`${URL_API}/${urlService}/${payload.id}`, payload)
      .then(({ data }) => {
        commit("actualizarPlanTrabajoSuccess", payload);
        resolve(data);
      })
      .catch(error => {
        console.log(error.response);
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetPlanTrabajoAction({ commit }) {
  commit("unsetPlanTrabajo");
}
