<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Comite De Emergencia</div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Datos del Comite de Emergencia</p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.nombre"
                label="Nombre de la organización"
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
          :disable="getOrganizacionState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getOrganizacionState.loading"
          :disable="getOrganizacionState.loading"
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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ComiteEmergenciaForm",
  data(){
    return {
    show: true,
    comiteEmergencia: {},
    encuestaID: 0,
    options: [],
  }},
      created(){
      this.encuestaID = this.$route.params.id
      this.comiteEmergencia = {
        id: 0,
        nombre:'',

      }
      if(Object.keys(this.getComiteEmergenciaState.objComiteEmergencia).length > 0){
        this.organizacion.id = this.getOrganizacionState.objOrganizacion.id;
        this.organizacion.nombre = this.getOrganizacionState.objOrganizacion.nombre;
      }

    },methods:{
    ...mapActions('comiteEmergencia', ['registrarComiteEmergenciaAction', 'actualizarComiteEmergenciaAction','unsetComiteEmergenciaAction']),
    onSubmit(){

      let info = {
        ...this.comiteEmergencia,
        encuesta: {
          id: this.encuestaID
        }
      }

      if(info.id > 0){
        this.actualizarComiteEmergenciaActionAction(info).then(() => {
        })
      }else{
        this.registrarComiteEmergenciaActionAction(info).then( data => {
          this.comiteEmergencia.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('comiteEmergencia', ['getComiteEmergenciaState']),
    mensajeBoton(){
      return this.comiteEmergencia.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetComiteEmergenciaActionAction()
  }
}
</script>

<style scoped>

</style>
