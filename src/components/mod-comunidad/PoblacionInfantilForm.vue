<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Atención a la Población Infantil</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos generales</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="poblacionInfantil.tipoPrograma"
                :options="tipoPoblacionInfantilOptions"
                label="Seleccione el tipo de Programa" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="poblacionInfantil.noHogares" label="No. Hogares" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="poblacionInfantil.noNina" label="No. Niñas" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="poblacionInfantil.noNino" label="No. Niños" />
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
            :disable="getPoblacionInfantilState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getPoblacionInfantilState.loading"
            :disable="getPoblacionInfantilState.loading"
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
import { mapGetters, mapActions } from 'vuex'
import { CATEGORIAS } from '../../utils/config'
export default {
  data(){
    return {
      show: true,
      poblacionInfantil: {},
      encuestaID: 0,
      tipoPoblacionInfantilOptions: []
    }
  },
  created(){
    let categorias = [CATEGORIAS.PROGRAMAS_INFANTILES]
    this.encuestaID = this.$route.params.id
    this.poblacionInfantil = {
      id: 0,
      tipoPrograma: '',
      noHogares:'',
      noNina: '',
      noNino: '',
    }
    if(Object.keys(this.getPoblacionInfantilState.objPoblacionInfantil).length > 0){
      this.poblacionInfantil.id = this.getPoblacionInfantilState.objPoblacionInfantil.id;
      this.poblacionInfantil.tipoPrograma = this.getPoblacionInfantilState.objPoblacionInfantil.tipoPrograma;
      this.poblacionInfantil.noHogares = this.getPoblacionInfantilState.objPoblacionInfantil.noHogares;
      this.poblacionInfantil.noNina = this.getPoblacionInfantilState.objPoblacionInfantil.noNina;
      this.poblacionInfantil.noNino = this.getPoblacionInfantilState.objPoblacionInfantil.noNino;

    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
            this.tipoPoblacionInfantilOptions = data
        })

  },
  methods: {
    ...mapActions('poblacionInfantil', ['registrarPoblacionInfantilAction', 'actualizarPoblacionInfantilAction','unsetPoblacionInfantilAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.poblacionInfantil,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        //Actualizar
        info.usuarioCreacion = this.getPoblacionInfantilState.objPoblacionInfantil.usuarioCreacion
        this.actualizarPoblacionInfantilAction(info).then(() => {
        })
      }else{
        //Guardar
        this.registrarPoblacionInfantilAction(info).then( data => {
          this.poblacionInfantil.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('poblacionInfantil', ['getPoblacionInfantilState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.poblacionInfantil.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetPoblacionInfantilAction()
  }


}
</script>

<style>

</style>
