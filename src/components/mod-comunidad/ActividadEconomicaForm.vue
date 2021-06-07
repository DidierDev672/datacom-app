<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Actividad Economica </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Datos de la Actividad Economica </p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="actividadEconomica.nombre"
                label="Nombre de la Actividad Economica"
              />
            </div>
          </div>

        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          :disable="getActividadEconomicaState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getActividadEconomicaState.loading"
          :disable="getActividadEconomicaState.loading"
          @click="onSubmit">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ActividadEconomicaForm",
  data(){
    return {
      show: true,
      actividadEconomica: {},
      encuestaID: 0,
      options: [],
    }},
  created(){
    this.encuestaID = this.$route.params.id
    this.actividadEconomica = {
      id: 0,
      nombre:'',

    }
    if(Object.keys(this.getComiteEmergenciaState.objComiteEmergencia).length > 0){
      this.organizacion.id = this.getOrganizacionState.objOrganizacion.id;
      this.organizacion.nombre = this.getOrganizacionState.objOrganizacion.nombre;
    }

  },methods:{
    ...mapActions('actividadEconomica', ['registrarActividadEconomicaAction', 'actualizarActividadEconomicaAction','unsetActividadEconomicaAction']),
    onSubmit(){

      let info = {
        ...this.actividadEconomica,
        encuesta: {
          id: this.encuestaID
        }
      }

      if(info.id > 0){
        this.actualizarActividadEconomicaAction(info).then(() => {
        })
      }else{
        this.registrarActividadEconomicaAction(info).then( data => {
          this.actividadEconomica.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('actividadEconomica', ['getActividadEconomicaState']),
    mensajeBoton(){
      return this.actividadEconomica.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetActividadEconomicaAction()
  }
}
</script>

<style scoped>

</style>
