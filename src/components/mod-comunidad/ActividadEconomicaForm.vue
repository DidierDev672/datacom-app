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
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="aEconomica.actividadEconomica"
                :options="options"
                label="Seleccione la actividad económica"
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
import {mapActions, mapGetters} from "vuex";
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "ActividadEconomicaForm",
  data(){
    return {
      show: true,
      aEconomica: {},
      encuestaID: 0,
      options: [],
    }},
  created(){
    let categorias = [CATEGORIAS.ACTIVDADES_ECONOMICAS]
    this.encuestaID = this.$route.params.id
    this.aEconomica = {
      id: 0,
      actividadEconomica:'',

    }
    if(Object.keys(this.getActividadEconomicaState.objActividadEconomica).length > 0){
      this.aEconomica.id = this.getActividadEconomicaState.objActividadEconomica.id;
      this.aEconomica.actividadEconomica = this.getActividadEconomicaState.objActividadEconomica.actividadEconomica;
    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data
    })

  },methods:{
    ...mapActions('actividadEconomica', ['registrarActividadEconomicaAction', 'actualizarActividadEconomicaAction','unsetActividadEconomicaAction']),
    ...mapActions('parametros',['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.aEconomica,
        encuesta: {
          id: this.encuestaID
        }
      }

      if(info.id > 0){
        this.actualizarActividadEconomicaAction(info).then(() => {

        })
      }else{
        this.registrarActividadEconomicaAction(info).then( data => {
          this.aEconomica.id = data
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
      return this.aEconomica.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetActividadEconomicaAction()
  }
}
</script>

<style scoped>

</style>
