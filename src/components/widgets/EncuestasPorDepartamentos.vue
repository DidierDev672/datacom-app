<template>
  <div>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Viviendas por departamentos</div>
        <div class="text-subtitle2">Datacom</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col">
            <q-table
              class="organizacion-table"
              :data="encuestasPorDepartamentos"
              :columns="columns"
              :rows-per-page-options="[10, 15, 25]"
              row-key="name"
              wrap-cells
              :loading="loading"
              loading-label="Cargando información, por favor espere"
            ></q-table>
          </div>
          <div class="col">
            <apexcharts width="100%" height="350px" type="pie" :options="options" ></apexcharts>            
          </div>
        </div>
      </q-card-section>

      
    </q-card>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { mapActions, mapGetters } from "vuex";
export default {
  name: "WidgetUltimasOrganizaciones",
  components: {apexcharts: VueApexCharts},
  data() {
    return {
      loading: false,
      encuestasPorDepartamentos: [],
      columns: [
        {
          name: "departamento",
          align: "left",
          label: "Departamento",
          field: "departamento"
        },
        {
          name: "cant",
          align: "left",
          label: "Cant.",
          field: "cant"
        }
      ],
      options: {
        colors:['#64c2c8', '#afca0b'],
        chart: {
          id: 'Viviendas por departamento'
        },
        xaxis: {
          categories: []
        }
      },
      series: [
          {
              name: 'Viviendas por departamento',
              data: []
          }
      ]
    };
  },
  created() {
    this.loading = true;
    this.cargarTotalEncuestasPorDepartamentosAction().then(data => {
      
      this.encuestasPorDepartamentos = data;
      this.loading = false;

      this.options = {
        colors:['#64c2c8', '#afca0b', '868686'],
        chart: {
          id: 'Viviendas por departamento'
        },
        series: data.map(obj => parseInt(obj.cant)),
        labels: data.map(obj => obj.departamento),
        legend:{
          position: 'bottom'
        }
      }

    });
  },
  methods: {
    ...mapActions("encuesta", ["cargarTotalEncuestasPorDepartamentosAction"])
  }
};
</script>
