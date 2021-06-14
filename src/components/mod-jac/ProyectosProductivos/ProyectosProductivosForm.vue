<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Cotratos Jac </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Datos de Proyecto Productivos Jac </p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="proyectosProductivosDB.linea"
                :options="options"
                label="Seleccione la linea"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="proyectosProductivosDB.descripcion"
                label="Descripcion"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="proyectosProductivosDB.avaluo"
                label="Avaluo"
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
          :disable="getProyectosProductivosState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getProyectosProductivosState.loading"
          :disable="getProyectosProductivosState.loading"
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
  name: "ProyectosProductivosForm",
  data(){
    return {
      show: true,
      proyectosProductivosDB: {},
      jacID: 0,
      options: [],

    }},
  created(){
    let categorias = [CATEGORIAS.LINEA]
    this.jacID = this.$route.params.id
    this.proyectosProductivosDB = {
      id: 0,
      linea:'',
      descripcion: '',
      avaluo:''

    }
    if(Object.keys(this.getProyectosProductivosState.objProyectosProductivos).length > 0){
      this.proyectosProductivosDB.id = this.getProyectosProductivosState.objProyectosProductivos.id;
      this.proyectosProductivosDB.linea = this.getContratosState.objProyectosProductivos.linea;
      this.proyectosProductivosDB.observacion = this.getProyectosProductivosState.objProyectosProductivos.descripcion;
      this.proyectosProductivosDB.avaluo = this.getProyectosProductivosState.objProyectosProductivos.avaluo;
    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data
    })

  },methods:{
    ...mapActions('proyectosProductivos', ['registrarProyectosProductivosAction', 'actualizarProyectosProductivosAction','unsetProyectosProductivosAction']),
    ...mapActions('parametros',['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.proyectosProductivosDB,
        jac: {
          id: this.jacID
        }
      }

      if(info.id > 0){
        this.actualizarProyectosProductivosAction(info).then(() => {

        })
      }else{
        this.registrarProyectosProductivosAction(info).then( data => {
          this.proyectosProductivosDB.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('proyectosProductivos', ['getProyectosProductivosState']),
    mensajeBoton(){
      return this.proyectosProductivosDB.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetProyectosProductivosAction()
  }
}
</script>

<style scoped>

</style>
