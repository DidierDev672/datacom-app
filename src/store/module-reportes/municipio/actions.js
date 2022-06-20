import axios from 'axios';
import { URL_API } from '../../../utils/config';

export function reporteFichaMunicipioAction({ commit }, payload) {
    const urlService = 'reporte-ficha-municipio';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/${payload}`)
            .then(({ data }) => {
                commit('setChartdataSuccess', data);
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

export function reporteEjemploAction({ commit }) {
    const urlService = 'reporte-de-ejemplo';
    return new Promise((resolve, reject) => {
        axios
            .get(`${URL_API}/${urlService}/`, { responseType: 'blob' })
            .then(({ data }) => {
                const url = window.URL.createObjectURL(data);
                // console.log('Url: ', url)
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.href = url;
                a.download = 'ReporteEjemplo.pdf';
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
