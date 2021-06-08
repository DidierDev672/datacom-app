import axios from 'axios'
import { URL_API } from '../../../../utils/config'

// Acciones para un objeto Calidad De Vida

export function registrarPersonalInfrasaludAction ({}, payload) {  
  const urlService = 'personal-salud'
  return new Promise((resolve, reject) => {
    axios.post(`${URL_API}/${urlService}/`, payload).then( ({data}) => {      
      resolve(data);
    }).catch( error => {
      reject(error.response);
    });
  });
}

export function eliminarPersonalInfrasaludAction ({}, payload) {  
  const urlService = 'personal-salud'
  return new Promise((resolve, reject) => {
    axios.delete(`${URL_API}/${urlService}/${payload}`).then( ({data}) => {      
      resolve(data);
    }).catch( error => {
      reject(error.response);
    });
  });
}
