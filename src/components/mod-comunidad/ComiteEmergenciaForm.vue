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
                v-model="comiteEmergencia.nombreComite"
                label="Nombre del comite de emergencia"
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
          :disable="getComiteEmergenciaState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getComiteEmergenciaState.loading"
          :disable="getComiteEmergenciaState.loading"
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
import {getComiteEmergenciaState} from "src/store/module-comunidad/comite-emergencia/getters";

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
        nombreComite:'',

      }
      if(Object.keys(this.getComiteEmergenciaState.objComiteEmergencia).length > 0){
        this.comiteEmergencia.id = this.getComiteEmergenciaState.objComiteEmergencia.id;
        this.comiteEmergencia.nombreComite = this.getComiteEmergenciaState.objComiteEmergencia.nombreComite;
      }

    },methods:{
    ...mapActions('comiteEmergencia', ['registrarComiteEmergenciaAction', 'actualizarComiteEmergenciaAction','unsetComiteEmergenciaAction']),
    onSubmit(){

      let info = {
        ...this.comiteEmergencia,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        info.usuarioCreacion = getComiteEmergenciaState.usuarioCreacion
        this.actualizarComiteEmergenciaAction(info).then(() => {
        })
      }else{
        this.registrarComiteEmergenciaAction(info).then( data => {
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
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.comiteEmergencia.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },

  beforeDestroy(){
    this.unsetComiteEmergenciaAction()
  }
}
</script>

<style scoped>

</style>
