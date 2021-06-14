<template>
  <div class="q-pa-md" id="tabla_indicadores">
    <q-card class="my-card">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Detalle Autoevaluación</div>
            <div class="text-subtitle2">{{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.nit }} - {{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.organizacion }}</div>
            <div class="text-caption">Puntaje Obtenido: {{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.calificacion }}</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="showPlanTrabajoForm = true">
                    <q-item-section>Plan de Trabajo</q-item-section>
                  </q-item>
                  <q-item clickable @click="imprimir">
                    <q-item-section>Imprimir</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-markup-table wrap-cells>
        <thead>
          <tr>
            <th class="text-center">Area</th>
            <th class="text-center">Subarea</th>
            <th class="text-center">Tema</th>
            <th class="text-lef">Indicador</th>
            <th class="text-center">Calificación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="registro in encuesta.detalleAutoevaluacion" :key="registro.id">
            <td class="text-left">{{ registro.indicador.tema.subarea.area.descripcion }}</td>
            <td class="text-left">{{ registro.indicador.tema.subarea.descripcion }}</td>
            <td class="text-left">{{ registro.indicador.tema.descripcion }}</td>
            <td class="text-left">{{ registro.indicador.descripcion }}</td>
            <td class="text-center">{{ registro.calificacion }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>

    <nuevo-plan-trabajo
      @close="cerrarModal"
      v-if="showPlanTrabajoForm" />


  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NuevoPlanTrabajo from 'src/components/ico-plan-trabajo/NuevoPlanTrabajo.vue'
import print from 'print-js'
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  components: { NuevoPlanTrabajo },
  data(){
    return {
      encuestaID: 0,
      infoGeneral: {},
      encuesta: {},
      showPlanTrabajoForm: false
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.infoGeneral = {...data}
      }
    })

    this.buscarEncuestaAction(this.encuestaID).then(data => {
      this.encuesta = data
    })
  },

  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction']),
    ...mapActions('encuesta',['buscarEncuestaAction']),
    imprimir(){
      print('tabla_indicadores', 'html')
    },
    cerrarModal(){
      this.showPlanTrabajoForm = false
    }
    // exportTable () {
    //   // naive encoding to csv format
    //   const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
    //     this.data.map(row => this.columns.map(col => wrapCsvValue(
    //       typeof col.field === 'function'
    //         ? col.field(row)
    //         : row[col.field === void 0 ? col.name : col.field],
    //       col.format
    //     )).join(','))
    //   ).join('\r\n')

    //   const status = exportFile(
    //     'table-export.csv',
    //     content,
    //     'text/csv'
    //   )

    //   if (status !== true) {
    //     this.$q.notify({
    //       message: 'Browser denied file download...',
    //       color: 'negative',
    //       icon: 'warning'
    //     })
    //   }
    // }
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
    ...mapGetters("detalleAutoevaluacion", ["getDetalleAutoevaluacionState"])
  }

}
</script>

<style>

</style>
