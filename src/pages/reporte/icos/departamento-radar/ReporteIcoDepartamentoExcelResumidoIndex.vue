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
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
export default {
  name: "ReporteIcoDepartamentoExcelResumidoIndex",
  data() {
    return {
      model: null,
      options: [],
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
    ...mapActions("reportesIcos", [
      "icosPorDepartamentoResumidoExcelAction",
      "icosPorDepartamentoRadarAction"
    ]),
    actualizarDepartamento(value) {
      console.log("Value: ", value);
      this.icosPorDepartamentoRadarAction(value.id).then(response => {
        console.log(response);
        this.data = response;
      });
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    exportarInformacion() {
      this.icosPorDepartamentoResumidoExcelAction(this.model.id).then(()=>{
        console.log('Funciona')
      });
    }
  }
};
</script>
