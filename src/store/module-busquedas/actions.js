import axios from "axios";
import { URL_API } from "../../utils/config";


export function buscarListaMunicipiosAction({ commit }, payload) {
  //commit("inicializarAccion");
  const urlService = "buscar";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/municipios-list/?page=${payload.page}&size=${payload.rowsPerPage}&filtro=${payload.filter}`
      )
      .then(response => {
        console.log("Municipios encontrados: ", response);
        //commit("setListaEncuestaSuccess", response.data.content);
        resolve(response);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al buscar los municipios: ",
          error.response
        );
        //commit("setActionFail", error.response);
        reject(error.response);
      });
  });
}

export function buscarListaDepartamentosAction({ commit }) {
  const urlService = "departamentos-list";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/`
      )
      .then(response => {
        console.log("Departamentos encontrados: ", response);
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al buscar los departamentos: ",
          error.response
        );
        reject(error.response);
      });
  });
}

export function buscarCoberturaMunicipioEducacionAction({ commit }, payload) {
  const urlService = "municipio-cobertura-educacion-list";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/${payload}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al buscar la cobertura en educacion: ",
          error.response
        );
        reject(error.response);
      });
  });
}

export function buscarMunicipioPruebasSaberAction({ commit }, payload) {
  const urlService = "municipio-cobertura-educacion-list";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/${payload}/pruebas-saber`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error al buscar las pruebas saber: ",
          error.response
        );
        reject(error.response);
      });
  });
}

export function buscarDeficitViviendaMunicipiosAction({ commit }) {
  const urlService = "municipio-deficit-vivienda";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error buscarDeficitViviendaMunicipiosAction: ",
          error.response
        );
        reject(error.response);
      });
  });
}

export function buscarIndicadoresEconomicosMunicipiosAction({ commit }, payload) {
  const urlService = "municipio-indicadores";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/${payload}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error buscarIndicadoresEconomicosMunicipiosAction: ",
          error.response
        );
        reject(error.response);
      });
  });
}

export function buscarPoliticasMunicipiosAction({ commit }) {
  const urlService = "municipio-politicas";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error buscarPoliticasMunicipiosAction: ",
          error.response
        );
        reject(error.response);
      });
  });
}

// Acciones para Icos

export function buscarIcoRadarAction({ commit }, payload) {
  const urlService = "ico-radar";
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${URL_API}/${urlService}/${payload}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(
          "Ocurrió un error buscarIcoRadarAction: ",
          error.response
        );
        reject(error.response);
      });
  });
}


