<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-md-6 offset-sm-3">
        <q-card>
          <q-card-section>
            <div class="q-gutter-sm row ">
              <div class="col">
                <q-select v-model="model" :options="options" option-value="id" option-label="nombreDepartamento"
                  label="Departamento" />
              </div>
              <div class="col">
                <q-select v-model="parametro" :options="parametros" option-value="id" option-label="nombre"
                  label="Tipo de estudio" />
              </div>
              <div class="col-auto items-bottom">
                <q-btn @click="filtrar" round color="primary" icon="search" />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <radar-chart
              :series="series"
              :categorias="categories"
            ></radar-chart>
          </q-card-section>
          <q-card-section v-if="info.titulo">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Departamento:</q-item-label>
                  <q-item-label caption>{{ info.titulo }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Generado el:</q-item-label>
                  <q-item-label caption>{{ info.fecha }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>No. de Jacs:</q-item-label>
                  <q-item-label caption>{{ info.totalJac }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
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
import { mapActions } from "vuex";
import { CATEGORIAS } from "src/utils/config";
import RadarChart from "src/components/widgets/RadarChart.vue";
export default {
  name: "ReporteIcoDepartamentoRadarIndex",
  components: { RadarChart },
  data() {
    return {
      model: null,
      parametros: [],
      parametro: null,
      options: [],
      series: [
        {
          name: "Máxima calificación",
          data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
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
        "Gestión Ambiental",
        "Gestión HSE",
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
      data: [],
      info: {}
    };
  },
  created() {
    let categorias = [CATEGORIAS.TIPOS_ESTUDIO];
    this.cargarListaDepartamentoAction().then(data => {
      this.options = data;
    });
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.parametros = data;
    });
  },
  methods: {
    ...mapActions("departamento", ["cargarListaDepartamentoAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("reportesIcos", ["icosPorDepartamentoRadarAction"]),
    // actualizarDepartamento(value) {
    //   console.log("Value: ", value);
    //   this.series = [
    //     {
    //       name: "Máxima calificación",
    //       data: [4, 4, 4, 4, 4, 4, 4, 4]
    //     }
    //   ];
    //   this.icosPorDepartamentoRadarAction(value.id).then(response => {
    //     console.log(response);
    //     this.data = response;
    //     this.series.push({
    //       name: value.nombreDepartamento,
    //       data: response.map(objIco => objIco.calificacion)
    //     });
    //   });
    // },
    filtrar() {
      if (this.model === null) {
        this.$q.notify({
          message: 'Debe seleccionar un Departamento.',
          position: 'bottom-right'
        })
        return;
      }
      if (this.parametro === null) {
        this.$q.notify({
          message: 'Debe seleccionar un tipo de estudio.',
          position: 'bottom-right'
        })
        return;
      }
      let payload = {
        departamento: this.model.id,
        estudio: this.parametro.id
      }
      this.series = [
        {
          name: "Máxima calificación",
          data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        }
      ];
      this.icosPorDepartamentoRadarAction(payload).then(response => {
        this.info = response;
        this.data = response.data;
        this.series.push({
          name: this.model.nombreDepartamento,
          data: this.data.map(objIco => objIco.calificacion)
        });
      });
    },
  }
};
</script>
