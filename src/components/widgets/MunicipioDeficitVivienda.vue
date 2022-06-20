<template>
    <div>
      <p>Viviendas</p>      
      <apexcharts width="100%" height="350px" type="line" :options="options" :series="series"></apexcharts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { mapActions } from 'vuex';
export default {
    components: {apexcharts: VueApexCharts},
  data () {
    return {
        options: {
              colors:['#64c2c8', '#afca0b'],
              chart: {
                id: 'Deficit vivienda'
              },
              xaxis: {
                categories: []
              }
            },
            series: [
                {
                    name: 'Deficit Cuántitativo',
                    data: []
                },
                {
                    name: 'Deficit Cualitativo',
                    data: []
                }
            ]
    }
  },
  created(){

      this.buscarDeficitViviendaMunicipiosAction().then(data => {
          this.options = {
              colors:['#64c2c8', '#afca0b'],
              chart: {
                id: 'Deficit vivienda'
              },
              xaxis: {
                categories: data.map(objMunicipio => objMunicipio.municipio)
              }
            },
            this.series = [
                {
                    name: 'Deficit Cuántitativo',
                    data: data.map(objMunicipio => objMunicipio.cuantitativo)
                },
                {
                    name: 'Deficit Cualitativo',
                    data: data.map(objMunicipio => objMunicipio.cualitativo)
                }
            ]

      })
      
  },
  methods: {
      ...mapActions('buscar', ['buscarDeficitViviendaMunicipiosAction']),     
  }
}
</script>

<style lang="sass">
</style>