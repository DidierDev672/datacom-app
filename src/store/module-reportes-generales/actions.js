import axios from "axios";
import { URL_API } from "../../utils/config";

// Acciones para la lista
export function cargarListaReportesGeneralesAction({ commit }) {
  commit("inicializarAccion");
  const urlService = "reportes-generales";
  return new Promise((resolve, reject) => {
    axios
      .get(`${URL_API}/${urlService}/`)
      .then(({ data }) => {
        commit("setListaReportesGeneralesSuccess", data);
        resolve(data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al consultar los tipos de reportes: ",
          error.response
        );
        commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}
