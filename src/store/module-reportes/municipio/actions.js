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
