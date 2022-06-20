<template>
    <div>
      <p>Cobertura neta en educación</p>
      <q-select
        v-model="departamento"
        :options="departamentos"
        option-value="id"
        option-label="name"       
        @input="changeOptions"
        label="Departamento" />
      <apexcharts width="500" type="bar" :options="options" :series="series"></apexcharts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { mapActions } from 'vuex'

    export default {

        components: {apexcharts: VueApexCharts},

        data() {
          return {
            departamento: null,
            departamentos: [],
            options: {
              colors:['#64c2c8'],
              chart: {
                id: 'vuechart-example'
              },
              xaxis: {
                categories: []
              }
            },
            series: [{
              name: 'series-1',
              data: []
            }]
          }
      },
      mounted(){   
        this.departamento = {
          id: 1,
          name: 'ANTIOQUIA'
        }     
        this.buscarListaDepartamentosAction().then(data => {
          this.departamentos = data
        })

        this.buscarCoberturaMunicipioEducacionAction(this.departamento.id).then(data => {
          this.options = {
              chart: {
                id: 'vuechart-example'
              },
              xaxis: {
                categories: data.map(objCobertura => objCobertura.municipio)
              }
            },
            this.series = [{
              name: 'Cobertura en educación',
              data: data.map(objCobertura => objCobertura.cobertura)
            }]
        })
      },
      methods: {
        ...mapActions('buscar', ['buscarListaDepartamentosAction', 'buscarCoberturaMunicipioEducacionAction']),
        updateGrafico(){
          this.series = [
            {
              name: 'Series-2',
              data: [30, 40, 45, 50, 49, 60, 70, 81]
            }
          ]
        },
        changeOptions(){
          this.buscarCoberturaMunicipioEducacionAction(this.departamento.id).then(data => {
            this.options = {
                chart: {
                  id: 'vuechart-example'
                },
                xaxis: {
                  categories: data.map(objCobertura => objCobertura.municipio)
                }
              },
              this.series = [{
                name: 'Cobertura en educación',
                data: data.map(objCobertura => objCobertura.cobertura)
              }]
          })
        }
      }
        
    }
</script>

<style lang="scss" scoped>

</style>