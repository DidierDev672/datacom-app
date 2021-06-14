<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Habilidades Jac </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Habilidades JAC </p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="habilidadesDB.temaCapacitacion"
                :options="options"
                label="Seleccione la Habilidad"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="habilidadesDB.entidadQueCapacita"
                label="Entidad Que Capacita"
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
          :disable="getHabilidadesState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getHabilidadesState.loading"
          :disable="getHabilidadesState.loading"
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
  name: "HabilidadesForm",
  data(){
    return {
      show: true,
      habilidadesDB: {},
      jacID: 0,
      options: [],

    }},
  created(){
    let categorias = [CATEGORIAS.TEMAS_CAPACITACION]
    this.jacID = this.$route.params.id
    this.habilidadesDB = {
      id: 0,
      temaCapacitacion:'',
      entidadQueCapacita: ''
    }
    if(Object.keys(this.getHabilidadesState.objHabilidades).length > 0){
      this.habilidadesDB.id = this.getHabilidadesState.objHabilidades.id;
      this.habilidadesDB.temaCapacitacion = this.getHabilidadesState.objHabilidades.temaCapacitacion;
      this.habilidadesDB.entidadQueCapacita = this.getHabilidadesState.objHabilidades.entidadQueCapacita;

    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data
    })

  },methods:{
    ...mapActions('habilidades', ['registrarHabilidadesAction', 'actualizarHabilidadesAction','unsetHabilidadesAction']),
    ...mapActions('parametros',['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.habilidadesDB,
        jac: {
          id: this.jacID
        }
      }

      if(info.id > 0){
        this.actualizarHabilidadesAction(info).then(() => {

        })
      }else{
        this.registrarHabilidadesAction(info).then( data => {
          this.habilidadesDB.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('habilidades', ['getHabilidadesState']),
    mensajeBoton(){
      return this.habilidadesDB.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetHabilidadesAction()
  }
}
</script>

<style scoped>

</style>
