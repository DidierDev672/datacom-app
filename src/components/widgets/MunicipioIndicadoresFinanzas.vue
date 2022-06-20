<template>
    <div>
      <p>Indicadores financieros</p>
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
              colors:['#64c2c8', '#c10015', '#afca0b'],
              chart: {
                id: 'vuechart-example',
                type: 'bar',
                stacked: true
              },
              plotOptions: {
                    bar: {
                        horizontal: true,
                    },
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

        this.buscarIndicadoresEconomicosMunicipiosAction(this.departamento.id).then(data => {
          this.options = {
              chart: {
                id: 'vuechart-example'
              },
              xaxis: {
                categories: data.map(objIndicadores => objIndicadores.municipio)
              }
            },
            this.series = [
                {
                    name: 'IndicadorFiscal',
                    data: data.map(objIndicadores => objIndicadores.fiscal)
                },
                {
                    name: 'IndicadorFuncionamiento',
                    data: data.map(objIndicadores => objIndicadores.funcionamiento)
                },
                {
                    name: 'IndicadorDesempeño',
                    data: data.map(objIndicadores => objIndicadores.desempenio)
                }

            ]
        })
      },
      methods: {
        ...mapActions('buscar', ['buscarListaDepartamentosAction', 'buscarIndicadoresEconomicosMunicipiosAction']),        
        changeOptions(){
          this.buscarIndicadoresEconomicosMunicipiosAction(this.departamento.id).then(data => {
            this.options = {
                chart: {
                  id: 'vuechart-example'
                },
                xaxis: {
                  categories: data.map(objIndicadores => objIndicadores.municipio)
                }
              },
              this.series = this.series = [
                {
                    name: 'IndicadorFiscal',
                    data: data.map(objIndicadores => objIndicadores.fiscal)
                },
                {
                    name: 'IndicadorFuncionamiento',
                    data: data.map(objIndicadores => objIndicadores.funcionamiento)
                },
                {
                    name: 'IndicadorDesempeño',
                    data: data.map(objIndicadores => objIndicadores.desempenio)
                }

            ]
          })
        }
      }
        
    }
</script>

<style lang="scss" scoped>

</style>