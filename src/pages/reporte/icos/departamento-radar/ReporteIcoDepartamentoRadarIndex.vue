<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-md-6 offset-sm-3">
        <q-card>
          <q-card-section>
            <q-select
              v-model="model"
              :options="options"
              option-value="id"
              option-label="nombreDepartamento"
              label="Departamento"
              @input="actualizarDepartamento(model)"
            />
          </q-card-section>
          <q-card-section>
            <radar-chart
              :series="series"
              :categorias="categories"
            ></radar-chart>
          </q-card-section>
          <q-card-section>
            <q-table
              v-if="data.length > 0"
              :data="data"
              :columns="columns"
              bordered
              flat
              row-key="name"
              :rows-per-page-options="[10, 20]"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RadarChart from "src/components/widgets/RadarChart.vue";
export default {
  name: "ReporteIcoDepartamentoRadarIndex",
  components: { RadarChart },
  data() {
    return {
      model: null,
      options: [],
      series: [
        {
          name: "Máxima calificación",
          data: [4, 4, 4, 4, 4, 4, 4, 4]
        }
      ],
      categories: [
        "Administrativo y aspectos legales",
        "Asamblea de Asociados",
        "Capacitación",
        "Direccionamiento estratégico",
        "Ejecución de proyectos y contratos ",
        "Espacios de participación ciudadana y comunitaria",
        "Financiero",
        "Junta administradora o directiva"
      ],
      columns: [
        {
          name: "tema",
          label: "Componente",
          align: "left",
          field: "tema"
        },
        {
          name: "calificacion",
          align: "center",
          label: "Calificación",
          field: "calificacion"
        }
      ],
      data: []
    };
  },
  created() {
    this.cargarListaDepartamentoAction().then(data => {
      console.log("Departamentos: ", data);
      this.options = data;
    });
  },
  methods: {
    ...mapActions("departamento", ["cargarListaDepartamentoAction"]),
    ...mapActions("reportesIcos", ["icosPorDepartamentoRadarAction"]),
    actualizarDepartamento(value) {
      console.log("Value: ", value);
      this.series = [
        {
          name: "Máxima calificación",
          data: [4, 4, 4, 4, 4, 4, 4, 4]
        }
      ];
      this.icosPorDepartamentoRadarAction(value.id).then(response => {
        console.log(response);
        this.data = response;
        this.series.push({
          name: value.nombreDepartamento,
          data: response.map(objIco => objIco.calificacion)
        });
      });
    }
  }
};
</script>
