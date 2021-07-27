<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Participacion </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Participacion JAC </p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="participacionDB.espacioParticipacion"
                :options="options"
                label="Seleccione el tipo de participacion"
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
          :disable="getParticipacionState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getParticipacionState.loading"
          :disable="getParticipacionState.loading"
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
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "ParticipacionForm",
  data(){
    return {
      show: true,
      participacionDB: {},
      jacID: 0,
      options: [],

    }},
  created(){
    let categorias = [CATEGORIAS.PARTICIPACION_CIUDADANA]
    this.jacID = this.$route.params.id
    this.participacionDB = {
      id: 0,
      espacioParticipacion:''
    }
    if(Object.keys(this.getParticipacionState.objParticipacion).length > 0){
      this.participacionDB.id = this.getParticipacionState.objParticipacion.id;
      this.participacionDB.espacioParticipacion = this.getParticipacionState.objParticipacion.espacioParticipacion;

    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data
    })

  },methods:{
    ...mapActions ('participacion', ['registrarParticipacionAction', 'actualizarParticipacionAction','unsetParticipacionAction']),
    ...mapActions ('parametros',['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.participacionDB,
        jac: {
          id: this.jacID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        info.usuarioCreacion = this.getParticipacionState.objParticipacion.usuarioCreacion
        this.actualizarParticipacionAction(info).then(() => {

        })
      }else{
        this.registrarParticipacionAction(info).then( data => {
          this.participacionDB.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('participacion', ['getParticipacionState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.participacionDB.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetParticipacionAction()
  }
}
</script>

<style scoped>

</style>
