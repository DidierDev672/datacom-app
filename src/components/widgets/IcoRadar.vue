<template>
    <div>
      <apexcharts width="100%" type="radar" :options="options" :series="series"></apexcharts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { mapActions } from 'vuex';
export default {
    props: {
        title: {
            type: String,
            default: 'Cumplimiento por temas'
        }
    },
    components: {apexcharts: VueApexCharts},

  data () {
    return {
        icoID: 0,
        options: {
              colors:['#64c2c8'],
              chart: {
                id: 'Ico'
              },
              xaxis: {
                categories: []
              }
            },
            series: [
                {
                    name: 'Calificación',
                    data: []
                }
            ]
    }
  },
  created(){
      this.icoID = this.$route.params.id;
      this.buscarIcoRadarAction(this.icoID).then(data => {
          this.options = {
              colors:['#64c2c8'],
              chart: {
                id: 'Ico',
                height: 350
              },
              plotOptions: {
                radar: {
                  size: 140,
                  polygons: {
                    strokeColors: '#e9e9e9',
                    fill: {
                      colors: ['#f8f8f8', '#fff']
                    }
                  }
                }
              },
              dataLabels: {
                enabled: true
               },
              xaxis: {
                categories: data.map(objIco => objIco.tema)
              }
            },
            this.series = [
                {
                    name: 'Calificación',
                    data: data.map(objIco => objIco.calificacion)
                }
            ]

      })

  },
  methods: {
      ...mapActions('buscar', ['buscarIcoRadarAction']),
  }
}
</script>

<style lang="sass">
</style>
