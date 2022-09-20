import axios from 'axios';
import { URL_API } from '../../../utils/config';

export function icosPorDepartamentoRadarAction({ commit }, payload) {
    const urlService = 'icos-por-departamento-radar';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${payload}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((error) => {
                console.log(
                    'Ocurrió un error al consultar la data: ',
                    error.response
                );
                reject(error.response);
            });
    });
}

export function icosPorDepartamentoResumidoExcelAction({ commit }, payload) {
    const urlService = 'icos-por-departamento-resumido-csv';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${payload}`, { responseType: "blob" })
            .then(({ data }) => {
              this.loading = false;
              const url = window.URL.createObjectURL(data);
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.href = url;
              a.download = 'IcosPordepartamentoResumidoExcel.xls';
              a.click();
              return url;
            })
            .catch((error) => {
                console.log(
                    'Ocurrió un error al consultar la data: ',
                    error.response
                );
                reject(error.response);
            });
    });
}

export function icosPorDepartamentoExtendidoExcelAction({ commit }, payload) {
    const urlService = 'icos-por-departamento-extendido-csv';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${payload}`, { responseType: "blob" })
            .then(({ data }) => {
              this.loading = false;
              const url = window.URL.createObjectURL(data);
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.href = url;
              a.download = 'IcosPordepartamentoExtendidoExcel.xls';
              a.click();
              resolve(data);
              return url;
            })
            .catch((error) => {
                console.log(
                    'Ocurrió un error al consultar la data: ',
                    error.response
                );
                reject(error.response);
            });
    });
}
