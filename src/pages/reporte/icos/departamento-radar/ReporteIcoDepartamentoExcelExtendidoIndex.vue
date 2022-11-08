<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-md-6 offset-sm-3">
        <q-card>
          <q-card-section>
            <div class="q-gutter-sm row">
              <div class="col">
                <q-select v-model="model" :options="options" option-value="id" option-label="nombreDepartamento"
                  label="Departamento" />
              </div>
              <div class="col">
                <q-select v-model="parametro" :options="parametros" option-value="id" option-label="nombre" label="Tipo de estudio" />
              </div>
              <div class="col-auto items-bottom">
                <q-btn @click="filtrar" round color="primary" icon="search" />
              </div>
            </div>
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
            >
              <template v-slot:top-right>
                <q-btn
                  color="primary"
                  icon-right="archive"
                  label="Exportar excel"
                  no-caps
                  @click="exportarInformacion"
                />
              </template>
            </q-table>
          </q-card-section>
          <q-card-section v-if="cargando" class="text-center">
            <q-spinner-oval color="primary" size="2em" />
            <q-tooltip :offset="[0, 8]">Estamos exportando la información, por favor espere...</q-tooltip>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { CATEGORIAS } from "src/utils/config";
export default {
  name: "ReporteIcoDepartamentoExcelExtendidoIndex",
  data() {
    return {
      model: null,
      parametros: [],
      parametro: null,
      cargando: false,
      options: [],
      columns: [
        {
          name: "departamento",
          label: "Departamento",
          align: "left",
          field: "departamento"
        },
        {
          name: "municipio",
          align: "left",
          label: "Municipio",
          field: "municipio"
        },
        {
          name: "comunidad",
          align: "left",
          label: "Cominidad",
          field: "comunidad"
        },
        {
          name: "jac",
          align: "left",
          label: "Organización",
          field: "jac"
        },
        {
          name: "evaluacion",
          align: "left",
          label: "Evaluación",
          field: "evaluacion"
        },
        {
          name: "area",
          align: "left",
          label: "Área",
          field: "area"
        },
        {
          name: "subarea",
          align: "left",
          label: "Subarea",
          field: "subarea"
        },
        {
          name: "tema",
          align: "left",
          label: "Tema",
          field: "tema"
        },
        {
          name: "indicador",
          align: "left",
          label: "Indicador",
          field: "indicador"
        },
        {
          name: "calificacion",
          align: "left",
          label: "Calificación",
          field: "calificacion"
        },
        {
          name: "descriptor",
          align: "left",
          label: "Descriptor",
          field: "descriptor"
        }
      ],
      data: []
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
    ...mapActions("reportesIcos", [
      "icosPorDepartamentoExtendidoExcelAction",
      "icosPorDepartamentoRadarAction"
    ]),
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
      this.cargando = true;
      let payload = {
        departamento: this.model.id,
        estudio: this.parametro.id
      }
      this.icosPorDepartamentoExtendidoExcelAction(payload).then(response => {
        this.data = response;
        this.cargando = false;
      });
    },
    exportarInformacion() {
      this.icosPorDepartamentoResumidoExcelAction(this.model.id).then(() => {
        console.log("Funciona");
      });
    }
  }
};
</script>
