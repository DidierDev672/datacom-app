<template>
  <q-page class="flex flex-center">
    <h5>Menu Reportes Page</h5>
    <q-btn
      outlined
      color="primary"
      label="Bajar municipios csv" 
      @click="bajarMunicipios"/>
  </q-page>
</template>

<script>
import axios from "axios"
import { URL_API } from 'src/utils/config'
export default {
  name: 'PageMenuReportes',
  methods: {
    bajarMunicipios(){
      const urlService = 'reportes/ficha-municipal';
      const municipioID = 42
      axios.get(`${URL_API}/${urlService}/${municipioID}`, { responseType: 'blob' }).then( ({data}) => {
        console.log('DATA: ', data);
        setTimeout(() => {
            const url = window.URL.createObjectURL(data);
            console.log('Url: ', url)
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.href = url;
            a.download = "FichaMunicipio.xls";
            a.click();
            return url;

        }, 500)
      }).catch( error => {
        console.log('Error: ', error.response);
      });

    }
  }
}
</script>
