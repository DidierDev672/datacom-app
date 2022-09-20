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
export default {
  name: "ReporteIcoDepartamentoExcelExtendidoIndex",
  data() {
    return {
      model: null,
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
    this.cargarListaDepartamentoAction().then(data => {
      console.log("Departamentos: ", data);
      this.options = data;
    });
  },
  methods: {
    ...mapActions("departamento", ["cargarListaDepartamentoAction"]),
    ...mapActions("reportesIcos", [
      "icosPorDepartamentoExtendidoExcelAction",
      "icosPorDepartamentoRadarAction"
    ]),
    actualizarDepartamento(value) {
      this.cargando = true;
      this.icosPorDepartamentoExtendidoExcelAction(value.id).then(response => {
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
