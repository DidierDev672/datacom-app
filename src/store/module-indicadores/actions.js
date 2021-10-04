import axios from "axios";
import { URL_API } from "src/utils/config";

// Acciones para la lista
export function cargarListaIndicadoresAction({ commit }) {
  commit("inicializarAccion");
  const urlService = "ico-indicador";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaIndicadoresSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar los indicadores: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}
