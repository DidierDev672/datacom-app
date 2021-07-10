<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Evaluación</div>
            <div class="text-subtitle2">{{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.nit }} - {{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.organizacion }}</div>
            <div class="text-caption">Puntaje Obtenido: {{ getDetalleAutoevaluacionState.objDetalleAutoevaluacion.calificacion }}</div>
          </div>
        </div>

        <q-list bordered padding v-if="showDetalle && indicadores.length > 0">
          <!-- <q-item-label header>Indicadores para el plan de trabajo</q-item-label> -->

          <q-item tag="label" v-ripple v-for="registro in options" :key="registro.id">
            <q-item-section side top>
              <q-checkbox v-model="selected" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ registro.indicador.descripcion }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              {{ registro.calificacion }}
            </q-item-section>
          </q-item>

        </q-list>

        <q-list bordered padding v-else>
          <!-- <q-item-label header>Indicadores para el plan de trabajo</q-item-label> -->

          <q-item tag="label" v-ripple >

            <q-item-section>
              <q-item-label class="q-mb-md">El plan de trabajo se ha generado correctamente</q-item-label>
              <q-btn :to="{name: 'plan-trabajo', params:{id: planTrabajo.id}}" label="Ver plan de trabajo" />
            </q-item-section>

          </q-item>

        </q-list>

      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          @click="close"
        />
        <q-btn
          label="Generar Plan de Trabajo"
          color="primary"
          :loading="getPlanTrabajoState.loading"
          :disable="getPlanTrabajoState.loading || !showDetalle"
          @click="onSubmit"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "NuevoPlanTrabajoForm",
  data() {
    return {
      show: true,
      selected: true,
      planTrabajo: {},
      encuestaID: 0,
      options: [],
      showDetalle: true
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.planTrabajo = {
      id: 0,
      titulo: "Plan de Trabajo "+this.getDetalleAutoevaluacionState.objDetalleAutoevaluacion.organizacion,
      detalle: []
    };
    this.buscarPlanTrabajoPorEncuestaAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.planTrabajo.id = data.id
        this.showDetalle = false
      }
    }).catch(error => {
      this.$q.notify({
          message: 'Ha ocurrido un error al consultar el plan de trabajo:' + error.data.message,
          color: 'red'
      })
      console.log('Ha ocurrido un error al consultar el plan de trabajo:', error.data.message)
      this.close();
    })
  },
  methods: {
    ...mapActions("planTrabajo", ['registrarPlanTrabajoAction', 'buscarPlanTrabajoPorEncuestaAction']),
    onSubmit() {
      this.$q.loading.show({
        message: 'Espere mientras generamos el plan de trabajo...</span>'
      })
      let info = {
        ...this.planTrabajo,
        encuesta: {
          id: this.encuestaID
        },
        detalle: this.options
      };
      console.log('Plan de Trabajo: ', info);

      this.registrarPlanTrabajoAction(info).then(data => {
        this.planTrabajo.id = data
        this.showDetalle = false
        this.$q.loading.hide()
      }).catch(error => {
        console.log('Ocurrió un error al crear el plan de trabajo: '+ error);
        this.$q.loading.hide()
      })
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters("planTrabajo", ["getPlanTrabajoState"]),
    ...mapGetters("detalleAutoevaluacion", ["getDetalleAutoevaluacionState"]),
    ...mapGetters("encuesta", ["getEncuestaState"]),
    indicadores(){
      let opcionesArray = this.getEncuestaState.objEncuesta.detalleAutoevaluacion.map(opt => {
        if(opt.calificacion < 3){
          this.options.push({
            indicador: opt.indicador,
            calificacion: opt.calificacion
          })
          return {
            indicador: opt.indicador,
            calificacion: opt.calificacion
          }
        }
      })
      return opcionesArray
    }
  },
  beforeDestroy() {
    // this.unsetActividadEconomicaAction();
  }
};
</script>

<style scoped></style>
