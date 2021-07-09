import axios from "axios";
import { URL_API } from "src/utils/config";

// Acciones para la lista
export function cargarListaRolAction({ commit }, municipioID) {
  commit("inicializarAccion");
  const urlService = "roles";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaRolSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar los roles: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function unsetListaRolAction({ commit }) {
  commit("unsetListaRol");
}
